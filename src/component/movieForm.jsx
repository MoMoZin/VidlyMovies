import React, { Component } from 'react';
import Joi from "joi-browser";
import Form from './common/form';
import { getGenres } from '../services/genreService.js';
import { getMovie, saveMovie } from '../services/movieService';

class MovieForm extends Form {
    state = {
        data: { _id:'', title: '', genreId: '', numberInStock: '', dailyRentalRate: '' },
        genres: [],
        errors: {}
    };

    async componentDidMount() {
        await this.populateGenres();
        await this.populateMovie();               
    }

    async populateGenres() {
        const { data : genres } = await getGenres();
        this.setState({ genres });        
    }

    async populateMovie() {
        try {            
            const movieId = this.props.match.params.id;
            if (movieId === 'new') return;
            const { data: movie } = await getMovie(movieId);
            this.setState({ data : this.mapToViewModel(movie) });
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404)
                return this.props.history.replace("/not-found");
        }         
    }
    
    mapToViewModel(movie) {
        return {
            _id: movie._id,
            title: movie.title,
            genreId: movie.genre._id,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        }
    }

    schema = {
        _id: Joi.string().allow(null).allow(''),
        title: Joi.string().required().label('Title'),
        genreId: Joi.string().required().label('Genre'),
        numberInStock: Joi.number().required().min(0).max(100).label('Number in Stock'),
        dailyRentalRate: Joi.number().required().min(0).max(10).label('Rate')
    };

    doSubmit = async () => {
        await saveMovie(this.state.data);
        this.props.history.push("/movies");
    };    

    render() {    
        return (
            <div>
                <h1>Movie Form</h1>
                <form onSubmit={this.handleSubmit}> 
                    {this.renderInput("title", "Title")}   
                    {this.renderSelect(this.state.genres,"genreId","Genre")}
                    {this.renderInput("numberInStock","Number in Stock","number")}      
                    {this.renderInput("dailyRentalRate","Rate","number")}   
                    {this.renderButton("Save")}
                </form>
            </div>
        );
        }
        
}
 
export default MovieForm;