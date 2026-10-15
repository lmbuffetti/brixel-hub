export const articlesQuery = `
 query HubContentQuery(
  $siteHandle: String!
  $placementSlug: String!
) {
  placementEntries(
    site: [$siteHandle]
    slug: [$placementSlug]
  ) {
    ...on placement_default_Entry {
     slug
      title
      mainTitle
      subtitle
      logo {
        alt
        url
        width
        height
      }
      placementContent {
        ...on placementContent_pageEntryCard_BlockType {
          id
          typeHandle
          cardLink {
            typeHandle
            available
            url
            text
            target
            element {
              ...on pages_default_Entry {
                id
                title
                previewCopy
                mainImage {
                  url
                  alt
                  width
                  height
                  focalPoint
                  hasFocalPoint
                }
              }
            }
          }
        }
        ... on placementContent_externalLinkCard_BlockType {
          id
          typeHandle
          cardLink {
            typeHandle
            url
            text
            target
          }
          mainImage {
            url
            alt
            width
            height
            focalPoint
            hasFocalPoint
          }
          cardTitle
          previewCopy
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
      bannerButton {
        typeHandle
        available
        url
        text
        target
        element {
          id
          title
        }
      }
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

`;
