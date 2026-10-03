export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  size: number;
  image: string;
  type: 'House' | 'Apartment' | 'Villa' | 'Penthouse';
  isExclusive?: boolean;
  isNewArrival?: boolean;
  isForRent: boolean;
  isFeatured: boolean;
}

export const mockProperties: Property[] = [
  {
    id: 'feat-1',
    title: 'The Glass Pavilion',
    location: 'Beverly Hills, California',
    price: 5250000,
    beds: 5,
    baths: 4.5,
    size: 4200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM',
    type: 'Villa',
    isExclusive: true,
    isFeatured: true,
    isForRent: false
  },
  {
    id: 'feat-2',
    title: 'Azure Heights Penthouse',
    location: 'Downtown, Vancouver',
    price: 3800000,
    beds: 3,
    baths: 3,
    size: 2100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s',
    type: 'Penthouse',
    isNewArrival: true,
    isFeatured: true,
    isForRent: false
  },
  {
    id: 'market-1',
    title: 'Modern Family Home',
    location: '123 Pine St, Seattle',
    price: 850000,
    beds: 3,
    baths: 2,
    size: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E',
    type: 'House',
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-2',
    title: 'Urban Loft',
    location: '456 Elm Ave, Portland',
    price: 3200,
    beds: 1,
    baths: 1,
    size: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4',
    type: 'Apartment',
    isForRent: true,
    isFeatured: false
  },
  {
    id: 'market-3',
    title: 'Highland Retreat',
    location: '789 Mountain Rd, Bend',
    price: 620000,
    beds: 2,
    baths: 2,
    size: 98,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro',
    type: 'House',
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-4',
    title: 'Sea View Penthouse',
    location: '321 Ocean Dr, Miami',
    price: 4500,
    beds: 3,
    baths: 3,
    size: 180,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U',
    type: 'Penthouse',
    isForRent: true,
    isFeatured: false
  },
  {
    id: 'market-5',
    title: 'Central Studio',
    location: '555 Main St, Chicago',
    price: 550000,
    beds: 1,
    baths: 1,
    size: 50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE',
    type: 'Apartment',
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-6',
    title: 'Garden Villa',
    location: '999 Oak Ln, Austin',
    price: 2800,
    beds: 2,
    baths: 2,
    size: 110,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8',
    type: 'Villa',
    isForRent: true,
    isFeatured: false
  },

  // --- 10 New Properties ---
  {
    id: 'feat-3',
    title: 'Cliffside Infinity Estate',
    location: 'Malibu, California',
    price: 9750000,
    beds: 6,
    baths: 7,
    size: 6800,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80',
    type: 'Villa',
    isExclusive: true,
    isFeatured: true,
    isForRent: false
  },
  {
    id: 'feat-4',
    title: 'The Obsidian Tower',
    location: 'Manhattan, New York',
    price: 7200000,
    beds: 4,
    baths: 4,
    size: 3500,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
    type: 'Penthouse',
    isNewArrival: true,
    isFeatured: true,
    isForRent: false
  },
  {
    id: 'market-7',
    title: 'Riviera Maison',
    location: 'Cannes, France',
    price: 5600000,
    beds: 5,
    baths: 5,
    size: 4900,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
    type: 'Villa',
    isExclusive: true,
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-8',
    title: 'Skyline Residences',
    location: 'Dubai Marina, UAE',
    price: 8500,
    beds: 3,
    baths: 3,
    size: 220,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80',
    type: 'Apartment',
    isNewArrival: true,
    isForRent: true,
    isFeatured: false
  },
  {
    id: 'market-9',
    title: 'Tuscan Countryside Estate',
    location: 'Siena, Italy',
    price: 3100000,
    beds: 7,
    baths: 6,
    size: 5200,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
    type: 'Villa',
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-10',
    title: 'Lakefront Modern',
    location: 'Lake Tahoe, Nevada',
    price: 1850000,
    beds: 4,
    baths: 3,
    size: 2400,
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80',
    type: 'House',
    isNewArrival: true,
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-11',
    title: 'Zen Garden Retreat',
    location: 'Kyoto, Japan',
    price: 5800,
    beds: 2,
    baths: 2,
    size: 145,
    image: 'https://images.unsplash.com/photo-1604014238437-a2d8b4f02a1d?w=900&q=80',
    type: 'House',
    isForRent: true,
    isFeatured: false
  },
  {
    id: 'market-12',
    title: 'Harbor View Penthouse',
    location: 'Sydney, Australia',
    price: 4200000,
    beds: 3,
    baths: 3.5,
    size: 2800,
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80',
    type: 'Penthouse',
    isExclusive: true,
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-13',
    title: 'Alpine Chalet Luxe',
    location: 'Verbier, Switzerland',
    price: 6900000,
    beds: 6,
    baths: 5,
    size: 4600,
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=900&q=80',
    type: 'House',
    isExclusive: true,
    isForRent: false,
    isFeatured: false
  },
  {
    id: 'market-14',
    title: 'Soho Loft Collective',
    location: 'London, United Kingdom',
    price: 6200,
    beds: 2,
    baths: 2,
    size: 160,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
    type: 'Apartment',
    isNewArrival: true,
    isForRent: true,
    isFeatured: false
  }
];
