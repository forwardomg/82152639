import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button } from '../Button';
import { Title } from '@components/ui/Title';
import { UI_TEXT } from '@constants/ui';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <Title.H2 className={styles.errorTitle}>
              {UI_TEXT.ERROR_BOUNDARY.GENERAL.TITLE}
            </Title.H2>
            <p className={styles.errorMessage}>{UI_TEXT.ERROR_BOUNDARY.GENERAL.MESSAGE}</p>

            {import.meta.env.DEV && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>{UI_TEXT.ERROR_BOUNDARY.GENERAL.ERROR_DETAILS}</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <Button onClick={this.handleReset} variant="primary">
              {UI_TEXT.ERROR_BOUNDARY.GENERAL.TRY_AGAIN}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
