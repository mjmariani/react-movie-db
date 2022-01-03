import { useState, useEffect, useCallback } from 'react';
import API from '../API';
//helpers
import { isPersistedState } from '../helpers';
export const useMovieFetch = movieId => {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    //useCallback hook is used to prevent fetchMovie function from being recreated by react unless movieId changes
    //also necessary to prevent useEffect from creating an infinite loop

    const fetchMovie = useCallback(async () => {
        try{
            setLoading(true);
            setError(false);

            const movie = await API.fetchMovie(movieId);
            const credits = await API.fetchCredits(movieId);
            //Get directors only
            const directors = credits.crew.filter(
                member => member.job === 'Director'
            );

            setState({
                ...movie,
                actors: credits.cast,
                //ES6 syntax; directors will be returned as "directors: directors"
                directors
            })

            setLoading(false);

        } catch(error) {
            setError(true);
        }
    },[movieId]);

    //the function fetchMovies can also be inside the useEffect hook and then the useCallback hook won't be needed
    useEffect(() => {
        const sessionState = isPersistedState(movieId);

        if(sessionState){
            setState(sessionState);
            setLoading(false);
            return;
        }

        fetchMovie();
    }, [movieId, fetchMovie])

    //Write to sessionStorage
    useEffect(() => {
        sessionStorage.setItem(movieId, JSON.stringify(state));
    }, [movieId, state])

    return {state, loading, error};
}