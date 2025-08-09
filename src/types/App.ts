export interface App {
  id: string;
  name: string;
  icon: any;
  gradient: string;
  component: React.ComponentType<{ onClose: () => void }>;
}

export interface AppProps {
  onClose: () => void;
}