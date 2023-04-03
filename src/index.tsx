import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './redux/store';
import {BrowserRouter} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ThemeProvider from './components/ThemeProvider';
import {NotificationsProvider} from 'reapop';
import AppNotificationsSystem from './components/AppNotificationsSystem';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <ThemeProvider>
            <BrowserRouter>
              <ThemeProvider>
                <AppNotificationsSystem />
                <App />
              </ThemeProvider>
            </BrowserRouter>
          </ThemeProvider>
        </NotificationsProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
