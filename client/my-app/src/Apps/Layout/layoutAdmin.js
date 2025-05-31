import { useState } from "react";
import Main from "../../components/Main";
import NavBar from "../global/Navbar";
import TopBar from "../global/TopBar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";

function LayoutAdmin() {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="app" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                    <NavBar isSidebar={isSidebar} />
                    <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                        <TopBar setIsSidebar={setIsSidebar} />
                        <Main />
                    </div>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default LayoutAdmin;