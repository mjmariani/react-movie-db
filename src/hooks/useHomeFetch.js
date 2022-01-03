import { useState, useEffect, useRef } from 'react'; 

//API
import API from '../API';

//helpers
import {isPersistedState} from '../helpers';

const initialState = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
};

export const useHomeFetch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    //console.log(searchTerm)
    //if searchTerm state is changed then this component is re-rendered, therefore the fetchMovies function is called again
    const fetchMovies = async (page, searchTerm = "") => {
        try{
            setError(false);
            setLoading(true);
            
            const movies = await API.fetchMovies(searchTerm, page);

            setState(prev => ({
                ...movies, 
                //ternary operator usage below
                //add to results attribute of movies obj if page number is > 1
                results: 
                    page > 1 ? [...prev.results, ...movies.results] : [...movies.results]
            }))

        }catch(error){
            setError(true);
        }
        setLoading(false);
    };

    //run on initial render (when it's mounted) of component
    //Initial and search
    useEffect( ()=> {
        //grabbing state from sessionStorage
        if(!searchTerm){
            const sessionState = isPersistedState('homeState');

            if(sessionState) {
                setState(sessionState);
                return;
            }
        }

        setState(initialState);
        fetchMovies(1, searchTerm);
    }, [searchTerm]);

    //Load More
    useEffect(() => {
        if(!isLoadingMore) return;

        fetchMovies(state.page + 1, searchTerm);
        setIsLoadingMore(false);
    }, [isLoadingMore, searchTerm, state.page]);

    //Write to sessionStorage
    useEffect(() => {
        if(!searchTerm) sessionStorage.setItem('homeState', JSON.stringify(state))
    }, [searchTerm, state])

    return { state, loading, error, setSearchTerm, searchTerm, setIsLoadingMore };
};