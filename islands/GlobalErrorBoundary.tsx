import { Component, ComponentChildren, ErrorInfo } from "preact";

interface Props {
  children: ComponentChildren;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // @ts-ignore: override check
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // @ts-ignore: override check
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div class="min-h-screen flex items-center justify-center bg-secondary-900 text-white p-4">
          <div class="text-center max-w-md">
            <h1 class="text-4xl font-heading font-bold mb-4 text-primary">Ups!</h1>
            <p class="text-gray-400 mb-8">
              Coś poszło nie tak. Odśwież stronę lub spróbuj ponownie później.
            </p>
            <button
              onClick={() => globalThis.location.reload()}
              class="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-600 transition-colors"
            >
              Odśwież stronę
            </button>
            {this.state.error && (
              <pre class="mt-8 text-xs text-left text-gray-600 overflow-auto bg-black/30 p-4 rounded">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
