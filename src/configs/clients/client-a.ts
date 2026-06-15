import { ClientConfig } from '../types';

export const config: ClientConfig = {
  id: 'client-a',
  name: '企业客户 A',
  features: {
    enableAnalytics: true,
    enableSocialSharing: false,
    enableAdvancedSearch: true,
  },
  modules: ['dashboard', 'reports'],
  theme: {
    primaryColor: '#3b82f6', // Blue
    secondaryColor: '#1e40af',
    logoUrl: '/logos/client-a.png',
    borderRadius: '0.5rem',
  },
};