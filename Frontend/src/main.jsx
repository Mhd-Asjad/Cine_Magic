
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { persistor , store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from '@/components/ui/sonner'
import 'leaflet/dist/leaflet.css'

createRoot(document.getElementById('root')).render(

    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <App />
          <Toaster position="top-right" />
      </PersistGate>
    </Provider>
  
)