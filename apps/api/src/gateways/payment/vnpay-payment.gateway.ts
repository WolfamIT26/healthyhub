import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import type { HealthyHubEnvironment } from '../../config/environment';
import type {
  PaymentProviderGateway,
  ProviderPaymentQuery,
  ProviderPaymentRequest,
  ProviderPaymentResult,
  VerifiedPaymentWebhook,
} from '../../domain/payment/payment-provider.gateway';

const VNPAY_VERSION = '2.1.0';
const VNPAY_COMMAND = 'pay';
const VNPAY_ORDER_TYPE = 'other';
const VNPAY_LOCALE = 'vn';
const DEFAULT_IP = '127.0.0.1';
const PROVIDER_TIMEOUT_MS = 10_000;

export class VnpayPaymentSignatureError extends Error {
  readonly code = 'PAYMENT_SIGNATURE_INVALID';
  constructor() { super('Chữ ký VNPAY không hợp lệ.'); }
}

export class VnpayPaymentProviderError extends Error {
  readonly code = 'PAYMENT_PROVIDER_UNAVAILABLE';
  constructor(message = 'VNPAY sandbox không phản hồi đúng contract.') { super(message); }
}

export class VnpayPaymentGateway implements PaymentProviderGateway {
  readonly providerCode = 'vnpay' as const;

  constructor(private readonly env: HealthyHubEnvironment) {}

  async createPayment(request: ProviderPaymentRequest): Promise<ProviderPaymentResult> {
    const params = this.sign({
      vnp_Version: VNPAY_VERSION,
      vnp_Command: VNPAY_COMMAND,
      vnp_TmnCode: this.env.payment.vnpay.tmnCode,
      vnp_Amount: toVnpayAmount(request.amount),
      vnp_CurrCode: request.currency,
      vnp_TxnRef: request.providerReference,
      vnp_OrderInfo: sanitize(request.orderInfo || `HealthyHub order ${request.orderId}`),
      vnp_OrderType: VNPAY_ORDER_TYPE,
      vnp_Locale: VNPAY_LOCALE,
      vnp_ReturnUrl: request.returnUrl,
      vnp_IpAddr: request.ipAddress ?? DEFAULT_IP,
      vnp_CreateDate: formatDate(request.createdAt),
      vnp_ExpireDate: formatDate(request.expiresAt),
    });
    return {
      provider: this.providerCode,
      providerReference: request.providerReference,
      providerTransactionNo: null,
      status: 'pending',
      redirectUrl: `${this.env.payment.vnpay.paymentUrl}?${buildQueryString(params)}`,
    };
  }

  async queryPayment(providerReference: string, transactionDate?: Date): Promise<ProviderPaymentQuery> {
    const requestId = createRequestId();
    const requestCommand = 'querydr';
    const requestTransactionDate = formatDate(transactionDate ?? new Date());
    const requestCreateDate = formatDate(new Date());
    const requestOrderInfo = sanitize(`HealthyHub order ${providerReference}`);
    const payload = {
      vnp_RequestId: requestId,
      vnp_Version: VNPAY_VERSION,
      vnp_Command: requestCommand,
      vnp_TmnCode: this.env.payment.vnpay.tmnCode,
      vnp_TxnRef: providerReference,
      vnp_OrderInfo: requestOrderInfo,
      vnp_TransactionDate: requestTransactionDate,
      vnp_CreateDate: requestCreateDate,
      vnp_IpAddr: DEFAULT_IP,
      vnp_SecureHash: this.signPipe([
        requestId,
        VNPAY_VERSION,
        requestCommand,
        this.env.payment.vnpay.tmnCode,
        providerReference,
        requestTransactionDate,
        requestCreateDate,
        DEFAULT_IP,
        requestOrderInfo,
      ]),
    };
    let response: Response;
    try {
      response = await fetch(this.env.payment.vnpay.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      });
    } catch {
      throw new VnpayPaymentProviderError('VNPAY query timeout hoặc không kết nối được.');
    }
    if (!response.ok) throw new VnpayPaymentProviderError(`HTTP ${response.status}.`);
    const raw = (await response.json()) as Record<string, unknown>;
    this.verifyQueryResponse(raw);
    const responseReference = required(stringValue(raw.vnp_TxnRef) ?? undefined, 'vnp_TxnRef');
    const responseTmnCode = required(stringValue(raw.vnp_TmnCode) ?? undefined, 'vnp_TmnCode');
    if (responseReference !== providerReference || responseTmnCode !== this.env.payment.vnpay.tmnCode) {
      throw new VnpayPaymentProviderError('VNPAY trả về sai tham chiếu hoặc terminal.');
    }
    const responseCode = stringValue(raw.vnp_ResponseCode ?? raw.RspCode ?? raw.responseCode) ?? '99';
    const transactionStatus = stringValue(raw.vnp_TransactionStatus ?? raw.transactionStatus);
    return {
      provider: this.providerCode,
      providerReference,
      amount: fromVnpayAmount(required(stringValue(raw.vnp_Amount ?? raw.amount) ?? undefined, 'vnp_Amount')),
      currency: 'VND',
      providerTransactionNo: stringValue(raw.vnp_TransactionNo ?? raw.transactionNo),
      responseCode,
      transactionStatus,
      status: mapStatus(responseCode, transactionStatus),
      occurredAt: parseDate(stringValue(raw.vnp_PayDate ?? raw.vnp_TransactionDate)) ?? undefined,
    };
  }

  async verifyWebhook(
    _rawBody: Buffer,
    _headers: Readonly<Record<string, string | string[] | undefined>>,
    query?: Readonly<Record<string, string | string[] | undefined>>,
  ): Promise<VerifiedPaymentWebhook> {
    const params = flatten(query);
    const secureHash = params.vnp_SecureHash;
    if (!secureHash) throw new VnpayPaymentSignatureError();
    const expected = createHmac('sha512', this.env.payment.vnpay.hashSecret)
      .update(this.signatureBase(params))
      .digest('hex');
    if (!safeEqualHex(secureHash, expected)) throw new VnpayPaymentSignatureError();
    if (required(params.vnp_TmnCode, 'vnp_TmnCode') !== this.env.payment.vnpay.tmnCode) {
      throw new VnpayPaymentProviderError('VNPAY trả về sai terminal.');
    }
    const providerReference = required(params.vnp_TxnRef, 'vnp_TxnRef');
    const responseCode = required(params.vnp_ResponseCode ?? params.vnp_RspCode, 'vnp_ResponseCode');
    const transactionStatus = required(params.vnp_TransactionStatus, 'vnp_TransactionStatus');
    const providerTransactionNo = required(params.vnp_TransactionNo, 'vnp_TransactionNo');
    return {
      provider: this.providerCode,
      eventId: [providerReference, providerTransactionNo, responseCode, transactionStatus].join(':'),
      eventType: 'payment.notification',
      providerReference,
      providerTransactionNo,
      responseCode,
      transactionStatus,
      status: mapStatus(responseCode, transactionStatus),
      amount: fromVnpayAmount(required(params.vnp_Amount, 'vnp_Amount')),
      currency: 'VND',
      occurredAt: parseDate(params.vnp_PayDate ?? params.vnp_TransactionDate) ?? new Date(),
      verifiedAt: new Date(),
    };
  }

  private sign(params: Record<string, string>): Record<string, string> {
    const canonical = this.signatureBase(params);
    const secureHash = createHmac('sha512', this.env.payment.vnpay.hashSecret).update(canonical).digest('hex');
    return { ...params, vnp_SecureHash: secureHash };
  }

  private signPipe(values: Array<string | null | undefined>): string {
    return createHmac('sha512', this.env.payment.vnpay.hashSecret)
      .update(values.map((value) => value ?? '').join('|'))
      .digest('hex');
  }

  private verifyQueryResponse(raw: Readonly<Record<string, unknown>>): void {
    const secureHash = stringValue(raw.vnp_SecureHash);
    if (!secureHash) throw new VnpayPaymentSignatureError();
    const expected = this.signPipe([
      stringValue(raw.vnp_ResponseId),
      stringValue(raw.vnp_Command),
      stringValue(raw.vnp_ResponseCode),
      stringValue(raw.vnp_Message),
      stringValue(raw.vnp_TmnCode),
      stringValue(raw.vnp_TxnRef),
      stringValue(raw.vnp_Amount),
      stringValue(raw.vnp_BankCode),
      stringValue(raw.vnp_PayDate),
      stringValue(raw.vnp_TransactionNo),
      stringValue(raw.vnp_TransactionType),
      stringValue(raw.vnp_TransactionStatus),
      stringValue(raw.vnp_OrderInfo),
      stringValue(raw.vnp_PromotionCode),
      stringValue(raw.vnp_PromotionAmount),
    ]);
    if (!safeEqualHex(secureHash, expected)) throw new VnpayPaymentSignatureError();
  }

  private signatureBase(params: Readonly<Record<string, string>>): string {
    return new URLSearchParams(
      Object.entries(params)
        .filter(([key]) => key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType')
        .sort(([left], [right]) => left.localeCompare(right)),
    ).toString();
  }
}

function mapStatus(responseCode: string, transactionStatus: string | null) {
  if (responseCode === '00' && transactionStatus === '00') return 'paid';
  if (responseCode === '24') return 'cancelled';
  if (responseCode !== '00') return 'failed';
  if (transactionStatus === '01') return 'pending';
  return 'failed';
}

function toVnpayAmount(amount: string): string {
  const [whole, fraction = '00'] = amount.split('.');
  return `${whole}${fraction.padEnd(2, '0').slice(0, 2)}`.replace(/^0+(?=\d)/, '');
}

function fromVnpayAmount(amount: string): string {
  if (!/^\d{1,12}$/.test(amount)) {
    throw new VnpayPaymentProviderError('Số tiền VNPAY không hợp lệ.');
  }
  const value = BigInt(amount);
  return `${(value / 100n).toString()}.${(value % 100n).toString().padStart(2, '0')}`;
}

function formatDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date).reduce<Record<string, string>>((accumulator, part) => {
    if (part.type !== 'literal') accumulator[part.type] = part.value;
    return accumulator;
  }, {});
  return `${parts.year}${parts.month}${parts.day}${parts.hour}${parts.minute}${parts.second}`;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value || value.length !== 14) return null;
  const candidate = new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(8, 10)}:${value.slice(10, 12)}:${value.slice(12, 14)}+07:00`);
  return Number.isNaN(candidate.getTime()) ? null : candidate;
}

function createRequestId(): string {
  return `HHQ${Date.now().toString(36).toUpperCase()}${randomBytes(4).toString('hex').toUpperCase()}`;
}

function flatten(query?: Readonly<Record<string, string | string[] | undefined>>): Record<string, string> {
  if (!query) return {};
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, Array.isArray(value) ? value[0] ?? '' : value ?? '']),
  );
}

function required(value: string | undefined, name: string): string {
  if (!value) throw new VnpayPaymentProviderError(`Thiếu tham số ${name}.`);
  return value;
}

function sanitize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 255);
}

function safeEqualHex(left: string, right: string): boolean {
  try {
    const leftBuffer = Buffer.from(left.toLowerCase(), 'hex');
    const rightBuffer = Buffer.from(right.toLowerCase(), 'hex');
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  } catch {
    return false;
  }
}

function stringValue(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function buildQueryString(params: Record<string, string>): string {
  const ordered = Object.fromEntries(
    Object.entries(params).sort(([left], [right]) => left.localeCompare(right)),
  );
  return new URLSearchParams(ordered).toString();
}
