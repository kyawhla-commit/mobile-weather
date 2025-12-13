import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-50">
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-6 items-center max-w-sm"
      >
        <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-4">
          <Feather name="alert-triangle" size={32} color="white" />
        </View>
        
        <Text className="text-2xl font-bold text-white text-center mb-2">
          Something went wrong
        </Text>
        
        <Text className="text-white/90 text-center text-base mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </Text>
        
        <TouchableOpacity
          onPress={resetError}
          className="bg-white rounded-xl py-3 px-6"
        >
          <Text className="text-red-600 font-bold text-lg">
            Try Again
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      
      {__DEV__ && error && (
        <View className="mt-6 p-4 bg-gray-100 rounded-lg max-w-sm">
          <Text className="text-gray-800 font-bold mb-2">Debug Info:</Text>
          <Text className="text-gray-600 text-sm font-mono">
            {error.stack}
          </Text>
        </View>
      )}
    </View>
  );
};

// Hook for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      // Log error to crash reporting service in production
      console.error('Unhandled error:', error);
    }
  }, [error]);

  return {
    error,
    resetError,
    handleError,
  };
};