import React,{Component} from 'react';
import Spinner from "../components/Spinner/spinner";

import AuthContext from "../context/auth-context";

class BookingPage extends Component{
    state={
        isLoading: false,
        bookings: []
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({isLoading : true});
        const requestBody = {
            query: `
            query{
                bookings {
                    _id
                    createdAt
                    event{
                        _id
                        title
                        date
                    }
                }
            }
        `
        };

        const token = this.context.token;

        fetch('http://localhost:5000/graphql',{
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res=>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        }).then(resData=>{
            const bookings = resData.data.bookings;
            this.setState({
                bookings : bookings
            });
            this.setState({isLoading : false});
        }).catch(e=>{
            console.log(e);
            this.setState({isLoading : false});
        });
    }

    render(){
        return (
            <React.Fragment>
                {this.state.isLoading ? <Spinner/> :
                    <ul>
                        {this.state.bookings.map(booking => {
                            return (
                                <li key={booking._id}>
                                    {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
                                </li>
                            );
                        })
                        }
                    </ul>
                }
            </React.Fragment>
        );
    }
}

export default BookingPage;