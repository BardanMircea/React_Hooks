import './App.css'
import { LeftSidePanel } from './components/LeftSidePanel.tsx'

export const App = () => {
     
    // const [message, setMessage] = useState("Not currently doing anything")
    
    return(
        <div className="dashboard">
            <LeftSidePanel />
        </div>
    )
}
