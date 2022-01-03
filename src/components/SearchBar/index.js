import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
//Image
import searchIcon from '../../images/search-icon.svg';

//Styles
import { Wrapper, Content } from './SearchBar.styles';

const SearchBar = ({ setSearchTerm }) => {
    const [state, setState] = useState('');
    //useRef is not called in initial render
    const initial = useRef(true);

    useEffect(() => {

        //referencing the useRef variable initial to tell whether this is the initial render
        //if initial render, then useEffect won't be called
        if(initial.current){
            initial.current = false;
            return;
        }

        const timer = setTimeout(() => {
            setSearchTerm(state);
        }, 500)

        return () => clearTimeout(timer)
    }, [setSearchTerm, state])

    return (
        <Wrapper>
            <Content>
                <img src={searchIcon} alt='search-icon' />
                <input type = 'text' placeholder ='Search Movie' onChange={event => setState(event.currentTarget.value)}  value={state}/>
            </Content>
        </Wrapper>
        )
};

SearchBar.propTypes = {
    callback: PropTypes.func
};

export default SearchBar;