// Mock NetInfo for development until package is installed
// Install the real package with: npx expo install @react-native-community/netinfo

export interface NetInfoState {
  isConnected: boolean | null;
  type: string | null;
}

const NetInfo = {
  fetch: async (): Promise<NetInfoState> => {
    // Mock: always return online for now
    return {
      isConnected: true,
      type: 'wifi',
    };
  },
  addEventListener: (callback: (state: NetInfoState) => void) => {
    // Mock: call callback immediately with online state
    callback({
      isConnected: true,
      type: 'wifi',
    });
    
    // Return unsubscribe function
    return () => {};
  },
};

export default NetInfo;
