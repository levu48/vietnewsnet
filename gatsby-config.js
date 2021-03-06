const config = require("./data/SiteConfig");

const pathPrefix = config.pathPrefix === "/" ? "" : config.pathPrefix;

const regexExcludeRobots = /^(?!\/(dev-404-page|404|offline-plugin-app-shell-fallback|tags|categories)).*$/

module.exports = {
  pathPrefix: config.pathPrefix,
  siteMetadata: {
    siteUrl: config.siteUrl + pathPrefix,
    rssMetadata: {
      site_url: config.siteUrl + pathPrefix,
      feed_url: config.siteUrl + pathPrefix + config.siteRss,
      title: config.siteTitle,
      description: config.siteDescription,
      image_url: `${config.siteUrl + pathPrefix}/logos/logo-512.png`,
      author: config.userName,
      copyright: config.copyright
    }
  },
  plugins: [
    // {
    //   resolve: 'levu48-source-newsapi',
    //   options: {
    //     pages: [
    //       {
    //         title: 'Headlines News',
    //         slug: 'headline-news',
    //         url: 'https://newsapi.org/v2/top-headlines'
    //                 + '?apiKey=ca8f478ba3af4300ab29be359e0efc2f'
    //                 + '&country=us'
    //       }, {
    //         title: 'South China Sea',
    //         slug: 'south-china-sea',
    //         url: 'https://newsapi.org/v2/everything'
    //                 + '?apiKey=ca8f478ba3af4300ab29be359e0efc2f'
    //                 + '&q=South%20China%20Sea'
    //       }
    //     ]
    //   }
    // },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    // {
    //   resolve: 'gatsby-source-rss',
    //   options: {
    //     rssURL: 'http://rss.cnn.com/rss/cnn_topstories.rss'
    //   }
    // },

    // {
    //   resolve: 'gatsby-source-rss-feed',
    //   options: {
    //     rssURL: 'http://rss.cnn.com/rss/cnn_topstories.rss'
    //   }
    // },
    
    //"gatsby-source-newsapi",

    {
      resolve: 'gatsby-source-newsapi',
      options: {
        sources: [
          {
              url: 'https://newsapi.org/v2/top-headlines?apiKey=ca8f478ba3af4300ab29be359e0efc2f&country=us&pageSize=30',
              type: 'json'
          }, {
              url: 'https://newsapi.org/v2/everything?q=south%20china%20sea&sortBy=publishedAt&apiKey=ca8f478ba3af4300ab29be359e0efc2f&pageSize=10',
              type: 'json'
          }, {
              url: 'https://newsapi.org/v2/everything?q=vietnam&sortBy=publishedAt&apiKey=ca8f478ba3af4300ab29be359e0efc2f&language=en&pageSize=30',
              type: 'json'
          }
        ]
      }
    },


    // {
    //   resolve: 'levu48-source-rss',
    //   options: {
    //     rssURL: 'http://rss.cnn.com/rss/cnn_topstories.rss'
    //   }
    // },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/${config.blogPostDir}`
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1200
            }
          },
          {
            resolve: "gatsby-remark-responsive-iframe"
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-autolink-headers"
        ]
      }
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: config.siteGATrackingID
      }
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "#c62828"
      }
    },
    "gatsby-plugin-sharp",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-twitter",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/sitemap.xml",
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }

            allSitePage(
              filter: {
                path: {
                  regex: "${regexExcludeRobots}"
                }
              }
            ) {
              edges {
                node {
                  path
                }
              }
            }
        }`
      }
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: config.siteTitle,
        short_name: config.siteTitle,
        description: config.siteDescription,
        start_url: config.pathPrefix,
        background_color: "#e0e0e0",
        theme_color: "#c62828",
        display: "minimal-ui",
        icons: [
          {
            src: "/logos/logo-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logos/logo-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-plugin-feed",
      options: {
        setup(ref) {
          const ret = ref.query.site.siteMetadata.rssMetadata;
          ret.allMarkdownRemark = ref.query.allMarkdownRemark;
          ret.generator = "GatsbyJS Material Starter";
          return ret;
        },
        query: `
        {
          site {
            siteMetadata {
              rssMetadata {
                site_url
                feed_url
                title
                description
                image_url
                author
                copyright
              }
            }
          }
        }
      `,
        feeds: [
          {
            serialize(ctx) {
              const rssMetadata = ctx.query.site.siteMetadata.rssMetadata;
              return ctx.query.allMarkdownRemark.edges.map(edge => ({
                categories: edge.node.frontmatter.tags,
                date: edge.node.frontmatter.date,
                title: edge.node.frontmatter.title,
                description: edge.node.excerpt,
                author: rssMetadata.author,
                url: rssMetadata.site_url + edge.node.fields.slug,
                guid: rssMetadata.site_url + edge.node.fields.slug,
                custom_elements: [{ "content:encoded": edge.node.html }]
              }));
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    excerpt
                    html
                    timeToRead
                    fields { slug }
                    frontmatter {
                      title
                      cover
                      date
                      category
                      tags
                    }
                  }
                }
              }
            }
          `,
            output: config.siteRss
          }
        ]
      }
    }
  ]
};
