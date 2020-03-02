/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment: any = {
  production: true,
  // API
  api: {
    baseUrl: 'https://api-cri-figs.tierx.dev',
    defaultHeaders: {
      'Content-Type': 'application/ld+json',
    },
    pagination: {
      pageSize: 30,
    },
  },
};
