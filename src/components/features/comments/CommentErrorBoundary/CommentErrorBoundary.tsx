import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { UI_TEXT } from '@constants/ui';
import { Button } from '@ui/Button';
import styles from './CommentErrorBoundary.module.css';

interface CommentErrorBoundaryProps {
  children: ReactNode;
  commentId?: string;
}

interface CommentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class CommentErrorBoundary extends Component<
  CommentErrorBoundaryProps,
  CommentErrorBoundaryState
> {
  constructor(props: CommentErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): CommentErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Comment rendering error:', {
      error,
      errorInfo,
      commentId: this.props.commentId,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorComment}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorContent}>
            <p className={styles.errorText}>{UI_TEXT.ERROR_BOUNDARY.MESSAGE}</p>
            <Button onClick={this.handleRetry} variant="link">
              {UI_TEXT.ERROR_BOUNDARY.RETRY}
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
