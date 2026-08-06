import { Component, type ErrorInfo, type ReactNode } from 'react';

import { EmptyState } from './EmptyState';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      JSON.stringify({
        event: 'web_error_boundary',
        message: error.message,
        componentStack: info.componentStack,
      }),
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
          <EmptyState
            title="Giao diện đang gặp lỗi"
            description="Vui lòng tải lại trang hoặc thử lại sau ít phút."
          />
        </main>
      );
    }

    return this.props.children;
  }
}
