import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateReport from "../Components/CreateReport";
import config from "../config";
import moment from "moment";

function CustomizedTables({ rows }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", flexFlow: "wrap" }}>
      {rows.map((row) => (
        <Card
          key={row.name}
          sx={{
            margin: "10px",
            backgroundColor: "darkcyan",
            borderRadius: "10px",
          }}
        >
          <CardContent>
            <Typography variant="h6">Crop Name: {row?.crop?.name}</Typography>
            <Typography>Description: {row?.result}</Typography>
            <Typography>Created By: {row?.user?.name}</Typography>
            <Typography>
              Created At:{" "}
              {moment(row?.createdAt).format("DD-MM-YYYY hh:mm:mm A")}
            </Typography>
            <Typography>
              <br />
              <a
                href={`${config.HOST}:${config.PORT}/${row.pdf_path}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button sx={{ backgroundColor: "black" }} variant="contained">
                  View Report
                </Button>
              </a>
            </Typography>
          </CardContent>
        </Card>
      ))}
      {rows.length === 0 && (
        <Card sx={{ backgroundColor: "darkcyan", borderRadius: "10px" }}>
          <CardContent>
            <Typography variant="h6">Data Not Found</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(true);

  const onClose = () => {
    setOpen(false);
  };

  const getReports = () => {
    setLoader(true);
    axios
      .get(`${config.HOST}:${config.PORT}/api/reports`, {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        setLoader(false);
        if (data.success) {
          setReports(data?.data?.reverse());
          localStorage.setItem("reports", JSON.stringify(data.data));
        }
      })
      .catch((err) => {
        setLoader(false);
        let collection = localStorage.getItem("reports");
        setReports(JSON.parse(collection));
      });
  };

  useEffect(() => {
    getReports();
  }, [open]);

  return (
    <Grid>
      {loader ? (
        <Grid
          container
          justifyContent={"center"}
          alignContent={"center"}
          sx={{ p: 2 }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container sx={{ p: 3 }}>
          <Grid
            container
            justifyContent={"end"}
            alignContent={"center"}
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreateReport
              open={open}
              onClose={onClose}
              refreshContent={getReports}
            />
            <Button
              size="small"
              variant="contained"
              sx={{
                ml: 2,
                padding: "10px",
                width: "50vw",
                borderRadius: "10px",
                backgroundColor: "black",
              }}
              onClick={() => setOpen(true)}
              disableElevation
            >
              Create
            </Button>
          </Grid>
          <Grid container sx={{ mt: 2, justifyContent: "center" }}>
            <CustomizedTables rows={reports} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}




