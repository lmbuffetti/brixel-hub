export const articlesQuery = `
  query HubContentQuery(
    $siteHandle: String!
    $placementSlug: String!
  ) {
    placementEntries(
      site: [$siteHandle]
      slug: [$placementSlug]
      limit: 3
    ) {
      ...on placement_default_Entry {
        slug
        title
        placementContent(limit: 3) {
          ...on pages_default_Entry {
            id
            slug
            url
            title
            previewCopy
            mainImage {
              url
              width
              height
              alt
            }
          }
        }
      }
    }
  }
`;

export const bannersQuery = `
  query BannerQuery(
    $siteHandle: String!,
    $bannerSlug: String!
  ) {
    bannersEntries(
      site: [$siteHandle],
      slug: [$bannerSlug]
    ) {
      ...on banners_default_Entry {
        title
        description
        buttonLink
        buttonLabel
        mainImage {
          url
          width
          height
          alt
        }
        logo {
          url
          width
          height
          alt
        }
      }
    }
  }
`
