import React, { Component } from 'react';
import PropTypes from 'prop-types'
import sortBy from 'sort-by'

class ListUniversities extends Component {
  static propTypes = {
    universities: PropTypes.array.isRequired,
    showinguniversities: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    updateUniversities: PropTypes.func.isRequired,
    showDetails: PropTypes.func.isRequired,
  }

  render() {
    const { universities } = this.props
    let { showinguniversities} =this.props
    let { query} =this.props

    let shownuniversities

    if (showinguniversities.length<1&&query.length<1){
      shownuniversities=universities
    } else {
      shownuniversities=showinguniversities
    }

    shownuniversities.sort(sortBy('name'))

    return (
      <div className='list-universities'>
        <div className='list-universities-top'>
          <input
            className='search-universities'
            type='text'
            placeholder='Search universities'
            value={query}
            onChange={(event) => this.props.updateUniversities(event.target.value)}
            role="search"
            aria-labelledby="filter"
          />

        </div>

        <ol className='universities-list'>

          {shownuniversities.map((university) => (
                <li key={university.id} onClick={()=>{this.props.showDetails(university.name)}} className='universities-list-item' tabIndex="0">
                <div className='university-details'>
                  <p>{university.name}</p>
                  <p>{university.address}</p>
                  </div>
                  </li>
              ))
          }
        </ol>

      </div>
    )
  }
}

export default ListUniversities
