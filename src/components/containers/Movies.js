import React, { Component } from 'react'
import { CreateMovie, MovieList } from '../presentation'
import { APIManager } from '../../utils/'
import superagent from 'superagent'
import styles from './styles'
import store from '../../store/store'
import actions from '../../actions/actions'
import { connect } from 'react-redux'


class Movies extends Component{
  constructor(props){
    super(props)
		this.postMovie = this.postMovie.bind(this)
    this.state={

    }
  }

  componentDidMount(){
    console.log('componentDidMount: ')
  		APIManager.get('/api/movie', null, (err, response) => {
  			if (err){
  				alert('ERROR: '+err.message)
  				return
  			}
  			const movies = response.results
  			this.props.moviesReceived(movies)

				this.setState({
					movies: movies
				})
				console.log('Movies in container: ' + JSON.stringify(this.state.movies))
  		})
  	}

	handleSelectMovie(index){
	  // event.preventDefault()
	  this.props.selectMovie(index)
	}

	postMovie(movie){
		let updatedMovie = Object.assign({}, movie)
		APIManager.post('/api/movie', updatedMovie, (err, response) => {
			if (err){
				alert('ERROR: '+err.message)
				return
			}
			this.props.movieCreated(response.result)
		})
	}

	handleMovieSubmit(movie){

		if(this.state.movies.length == 0){
			this.postMovie(movie)

		}
		if(this.state.movies.length !=0){
			for(let i = 0; i < this.state.movies.length;i++){
				if(this.state.movies[i]['movieName']==movie.movieName){
					console.log("MOVIE INCLUDED")
					alert("THIS MOVIE HAS ALREADY BEEN CREATED")
					return
				}
			}

			this.postMovie(movie)
		}
	}





  render(){
    const movieList = this.props.list.map((movie, i) => {
      let selected = (i==this.props.selected)
      return(
        <li key={i} style={{marginBottom:0}}>
            <MovieList index={i}  isSelected={selected} selectMovie={this.handleSelectMovie.bind(this)}  currentMovie={movie}/>
        </li>
      )
    })

    return(
      <div>
        <div >
					<div className="headline-v2">
						<h2>Movie List:</h2>
					</div>
					<div>
						<ul className="list-unstyled blog-trending margin-bottom-50">
							{movieList}
						</ul>
					</div>
					<hr />
          <div className="headline-v2">
						<h2>Create Movie:</h2>
					</div>
          <div style={{marginBottom:50}}>
            <CreateMovie movie={this.props.movie} list={this.props.list} onCreateMovie={this.handleMovieSubmit.bind(this)}/>
          </div>
          <br /><br />
        </div>
      </div>
    )
  }
}

const dispatchToProps = (dispatch) => {
  return{
    moviesReceived: (movies) => dispatch(actions.moviesReceived(movies)),
    movieCreated: (movie) => dispatch(actions.movieCreated(movie)),
    selectMovie: (index) => dispatch(actions.selectMovie(index))
  }
}

const stateToProps = (state) => {
  return{
    list:state.movies.list,
    movie: state.movies.movie,
    selected:state.movies.selected
  }
}

export default connect (stateToProps, dispatchToProps)(Movies)
