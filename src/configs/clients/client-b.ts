import { ClientConfig } from '../types';

export const config: ClientConfig = {
  id: 'client-b',
  name: '企业客户 B',
  features: {
    enableAnalytics: false,
    enableSocialSharing: true,
    enableAdvancedSearch: false,
  },
  modules: ['dashboard', 'social-feed'],
  theme: {
    primaryColor: '#10b981', // Emerald
    secondaryColor: '#065f46',
    logoUrl: '/logos/client-b.png',
    borderRadius: '0.25rem',
  },
};
