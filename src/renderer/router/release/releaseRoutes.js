export default [
  {
    name: 'release',
    path: '/release/:releaseId/:releaseName',
    meta: { layout: { show_scroll: true, scroll_to_top: true } },
    props: true,
    component: () => import('@views/release')
  }
]
