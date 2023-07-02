const mapping: Record<string, string> = {
  organizations: 'organization',
  'text-analyses': 'text_analysis',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
