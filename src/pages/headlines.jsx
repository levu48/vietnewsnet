import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
// import Subheader from 'material-ui/Subheader';
// import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import MediaCard from '../components/News/MediaCard';
//import translate from 'translate-api';

//export default () => <h2>GridListExampleSimple</h2>;

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '0 -5px',
  },
  item: {
    margin: '0 5px 10px'
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
};

/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
class Headlines extends React.Component {
    // componentWillMount() {
    //     this.props.data.allNewsFeedItem.edgeds.forEach(async ({node}) => {
    //         node.title = translate.getText(node.title, {to: 'vi-VN'});
    //         node.description = translate.getTExt(node.description, {to: 'vi-VN'});
    //     })
    // }

    render() {
        const tilesData = this.props.data.allNewsFeedItem.edges;
        return (
            <div style={styles.root}>
                {tilesData.map(({node}) => (
                    <span style={styles.item}><MediaCard article={node}/></span>
                ))}
            </div>
        );
    }
}

export default Headlines;

export const HeadlinesQuery = graphql`
    query HeadlinesQuery {
        allNewsFeedItem {
            edges {
                node {
                    id
                    title
                    description
                    link    
                    url
                    urlToImage
                }
            }
        }
    }
`;