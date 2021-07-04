import {FormControl, TextField, Select, MenuItem, Button} from '@material-ui/core';

const UserDetailsBeforeJoining = (props) => {
    const {myVideo, setMyVideo, setSubmited} = props;
    return(
        <FormControl>
            <TextField label= "Enter your name" value={myName} onChange={(e) => setMyName(e.target.value)} />
            <Select
                labelId="videoType"
                id="videoType-select"
                value={myVideo}
                onChange={(e) => setMyVideo(e.target.value)}
            >
            <MenuItem value="screen">Share Screen</MenuItem>
            <MenuItem value="camera">Use Camera</MenuItem>
            </Select>
            <Button variant="contained" color="primary" onClick={() =>{setSubmited(true)}}>
                Join meeting
            </Button>
        </FormControl>
    )
}

export default UserDetailsBeforeJoining;