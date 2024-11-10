import { Button, Typography } from "@mui/material";

type StartPageProps = {
    setTripStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

const StartPage: React.FC<StartPageProps> = ({ setTripStarted }) => {
    return (
        <>
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            height: "50vh", 
            margin: "0 auto",
            textAlign: "left" 
        }}>
            <Typography sx={{ fontSize: 16, lineHeight: 1.1 }}>Welcome to</Typography>
            <Typography sx={{ fontSize: 40, fontWeight: 600, lineHeight: 1.1 }}>Driverite</Typography>
            <Typography sx={{ fontSize: 16, lineHeight: 1.1 }}>Press Start Trip to begin...</Typography>
        </div>
        <div style={{
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "75px", gap: "25px"
        }}>
        <Button 
            variant="contained" 
            sx={{ borderRadius: "20px", width: "50%", height: "50px" }}
            onClick={() => {setTripStarted(true)}}
        >
            Start Trip
        </Button>
        <Typography sx={{textAlign: "center", fontSize: 14, width: "75%"}}>
            Always make sure your device is 
            hands free while driving. Start your
            trip before you begin driving.
        </Typography>
        </div>
        </>
    );
}

export default StartPage;