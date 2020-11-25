import React from 'react';
import {NavLink} from 'react-router-dom';
import './mainNavigation.css';
import AuthContext from '../../context/auth-context';

const mainNavigation = (props) => {
    return (
        <AuthContext.Consumer>
            {(context)=> {
                return (
                    <header className="main-navigation">
                        <div className="main-navigation__logo">
                            <h1>Graphql Event</h1>
                        </div>
                        <nav className="main-navigation__item">
                            <ul>
                                {!context.token &&
                                    <li>
                                        <NavLink to="/auth">Authenticate</NavLink>
                                    </li>
                                }
                                <li>
                                    <NavLink to="/events">Events</NavLink>
                                </li>
                                {context.token && (
                                    <>
                                        <li>
                                            <NavLink to="/bookings">Bookings</NavLink>
                                        </li>
                                        <li>
                                            <button onClick={context.logout}>Log Out</button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </header>
                );
            }}
        </AuthContext.Consumer>
    );
};

export default mainNavigation;
