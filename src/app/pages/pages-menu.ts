import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Countries',
    icon: 'globe-2-outline',
    link: '/pages/entities/countries',
    queryParams: {
      'srt': 'name,asc'
    },
    home: true,
  },
  {
    title: 'Indicators',
    icon: 'activity-outline',
    link: '/pages/entities/indicators',
    home: true,
  },
  {
    title: 'Vocabularies',
    icon: 'book-open-outline',
    link: '/pages/entities/vocabularies',
    home: true,
  },
];
