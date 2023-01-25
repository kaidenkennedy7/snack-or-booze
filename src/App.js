import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import SnackOrBoozeApi from './Api';
import NavBar from './NavBar';
import MenuContext from './MenuContext';
import FullMenu from './FullMenu';
import MenuItem from './MenuItem';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState({});

  useEffect(() => {
    async function getItems() {
      let snacks = await SnackOrBoozeApi.getSnacks();
      let drinks = await SnackOrBoozeApi.getDrinks();
      setItems({ snacks, drinks });
      setIsLoading(false);
    }
    getItems();
  }, []);

  if (isLoading) {
    return <p>Loading</p>
  }

  const addItem = async (type, item) => 
    type === 'drinks' ? await SnackOrBoozeApi.addDrink(item) : await SnackOrBoozeApi.addSnack(item);

  return (
    <MenuContext.Provider value={{ items, setItems }}>
      <div className='App'>
        <BrowserRouter>
            <NavBar />
            <main>
              <Routes>
                <Route exact path='/' element={<Home items={items}/>}/>
                <Route exact path='/snacks' element={<FullMenu item={items.snacks} type='snacks' title='Snacks' addItem={addItem}/>}/>
                <Route path='/snacks/:id' element={<MenuItem items={items.snacks} cantFind='/snakcs'/>}/>
                <Route exact path='/drinks' element={<FullMenu items={items.drinks} type='drinks' title='Drinks' addItem={addItem}/>}/>
                <Route path='/drinks/:id' element={<MenuItem items={items.drinks} cantFind='/drinks'/>}/>
              </Routes>
            </main>
          </BrowserRouter>
        </div>
      </MenuContext.Provider>
  );
}

export default App;