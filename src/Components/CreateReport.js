import { Alert, Autocomplete, Button, Dialog, DialogContent, Divider, Grid, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Save } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';
import TakeImage from '../Pages/takeImage';

export default function CreateReport({ open, onClose, refreshContent }) {
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({})
    const [offline, setOffline] = useState(false);

    const getCrops = () => {
        setLoader(true);
        axios.get(`${config.HOST}:${config.PORT}/api/crops`, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        }).then(({ data }) => {
            setLoader(false);
            setOffline(false);
            if (data.success) {
                setCrops(data.data)
                localStorage.setItem("crops", JSON.stringify(data.data));
            }
        }).catch((err) => {
            setLoader(false);
            setOffline(true);
            let collection = localStorage.getItem("crops");
            if (collection) {
                setCrops(JSON.parse(collection))
            }

        })
    }

    const sendData = () => {
        let formData = new FormData();
        formData.append("cropImage", selectedFile)
        formData.append("cropId", selectedCrop.id)

        axios.post(`${config.HOST}:${config.PORT}/api/reports/generate`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': localStorage.getItem("token")
            }
        }).then(({ data }) => {
            setOffline(false);
            setLoader(false);
            console.log(data);
            if (data.success) {
                resetParams();
                onClose();
                refreshContent();
                toast.success("Submitted Successfully")
            }
            else {
                toast.error(data.message)
            }
        }).catch((err) => {
            setOffline(true);
            setLoader(false);
            toast.error(err.message || "Something went wrong")
            // let collection = localStorage.getItem("crops");
            // if(collection){
            //     setCrops(JSON.parse(collection))
            // }

        })
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const validateFields = () => {
        const errors = {}
        if (!selectedCrop) {
            errors["crop"] = "Crop is required!"
        }
        if (selectedFile == null) {
            errors["image"] = "Crop Image is required!"
        }
        return errors;
    }

    const handleSubmit = () => {
        const errors = validateFields();
        if (Object.keys(errors).length == 0) {
            sendData();
        }
        setErrors(errors);
    }

    const resetParams = () => {
        setErrors({});
        setLoader(false);
        setSelectedCrop(null);
        setSelectedFile(null);
    }
    useEffect(() => {
        resetParams();
        if (open) {
            getCrops();
        }
    }, [open])

    return (
      <Dialog
        open={open}
        onClose={onClose}
        scroll={"paper"}
        PaperProps={{
          sx: {
            width: "100%",
            backdropFilter: "blur(0.9)",
            padding: "10px 0px",
            backgroundColor: "darkslategray",
            color: "white",
          },
        }}
        maxWidth={"sm"}
      >
        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ p: 1 }}>
            <Typography sx={{ fontSize: "18px" }}>Create Report</Typography>
          </Grid>
          <Divider />
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ mt: 2 }}
          >
            {offline && (
              <Alert
                // severity="warning"
                sx={{ width: "90%", p: 0, pl: 2, pr: 2 }}
                action={
                  <Button size="small" onClick={getCrops}>
                    Please Retry
                  </Button>
                }
              >
                🧐 The device is currently offline. 🧐
              </Alert>
            )}
          </Grid>

          <Grid container sx={{ p: 1 }}>
            <Grid
              container
              item
              sm={4}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ marginBottom: "10px" }}
            >
              Crop Name*
            </Grid>
            <Grid container item sm={6}>
              <Autocomplete
                size="small"
                fullWidth
                value={selectedCrop}
                options={crops}
                onChange={(e, option) => {
                  setSelectedCrop(option);
                }}
                sx={{
                  color: "white",
                  border: "1px solid white",
                  borderRadius: "10px",
                }}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    sx={{ color: "white" }}
                    {...params}
                    label="Select Crop Name"
                  />
                )}
              />
              {errors.crop && (
                <Typography variant="p" sx={{ color: "red", fontSize: "12px" }}>
                  {errors.crop}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container sx={{ p: 2 }}>
            {/* <Grid container item sm={4} justifyContent={"center"} alignItems={"center"}>
                        Upload Image*
                    </Grid>
                    <Grid container item sm={6}>
                        <TextField
                            size='small'
                            fullWidth
                            type='file'
                            onChange={handleFileChange}
                        />
                     
                        
                    </Grid> */}
            <TakeImage setSelectedFile={setSelectedFile} />
            {errors.image && (
              <Typography variant="p" sx={{ color: "red", fontSize: "12px" }}>
                {errors.image}
              </Typography>
            )}
          </Grid>
          <Grid container sx={{ p: 2 }} justifyContent={"center"}>
            <Button
              variant="contained"
              style={{ backgroundColor: "red" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <LoadingButton
              disabled={offline}
              loading={loader}
              loadingPostition="start"
              startIcon={<Save />}
              variant="contained"
              sx={{ ml: 2, backgroundColor: "black" }}
              onClick={() => {
                setLoader(true);
                setTimeout(() => {
                  handleSubmit();
                  setLoader(false);
                }, 3000);
              }}
            >
              Submit
            </LoadingButton>
          </Grid>
        </DialogContent>
      </Dialog>
    );
}
