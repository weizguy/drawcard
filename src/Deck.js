import React, { Component } from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css';
const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = { deck: null, drawn: [], done: false };
    this.drawCard = this.drawCard.bind(this);
    this.shuffleDeck = this.shuffleDeck.bind(this);
  }
  async componentDidMount() {
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({ deck: deck.data });
  }
  async shuffleDeck() {
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({ deck: deck.data, drawn: [], done: false });
  }
  async drawCard() {
    let deck_id = this.state.deck.deck_id;
    try {
      let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
      let cardRes = await axios.get(cardUrl);
      if(!cardRes.data.success) {
        throw new Error('All cards have been drawn!');
      }
      let card = cardRes.data.cards[0];
      this.setState(st => ({
        drawn: [
          ...st.drawn,
          {
            id: card.code, 
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }));
    } catch (err) {
      this.setState({ done: true });
      alert('All 52 cards drawn, shuffle and play again!');
    }
  }

  render() {
    const cards = this.state.drawn.map(c => (
      <Card key={c.id} name={c.name} image={c.image} />
    ));
    let btn = '';
    if(this.state.done){
      btn = <button className='Deck-btn-shuffle' onClick={this.shuffleDeck}>Shuffle Deck</button>;
    } else {
      btn = <button className='Deck-btn-draw' onClick={this.drawCard}>Draw Card</button>;
    }
    return (
      <div className='Deck'>
        <h1 className='Deck-title'>♠♦ Card Dealer ♣♥</h1>
        <h2 className='Deck-title subtitle'> A quick demo made with React using API's </h2>
        {btn}
        <div className='Deck-display'>{cards}</div>
      </div>
    )
  }
}

export default Deck;