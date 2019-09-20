import React, {Fragment, useEffect, useState} from 'react';
import {
  Theme,
  useTheme,
  Box,
  Tab,
  Tabs,
  makeStyles,
  createStyles,
  AppBar,
  Container,
  CircularProgress,
  useMediaQuery, Snackbar, SnackbarContent,
} from '@material-ui/core';
import { useGet } from 'use-http';

import UserContext from '../../../contexts/User';
import Context from './Context';
import Brief from './Brief';
import RunCommand from './RunCommand';
import Log from './Log';
import Monitor from './Monitor';
import Endpoints from './Endpoints';
import { DLTSTabPanel } from '../../CommonComponents/DLTSTabPanel'
import {a11yProps} from "../../CommonComponents/a11yProps";
import SwipeableViews from "react-swipeable-views";
import theme from "../../../contexts/MonospacedTheme";
import {green} from "@material-ui/core/colors";
import {DLTSTabs} from "../../CommonComponents/DLTSTabs";
import {JobDetailTitles, readOnlyJobDetailTitles} from "../../../Constants/TabsContants";
import {DLTSSnackbar} from "../../CommonComponents/DLTSSnackbar";
interface Props {
  clusterId: string;
  jobId: string;
  job: any;
}

const JobDetails: React.FC<Props> = ({ clusterId, jobId, job }) => {
  const { email } = React.useContext(UserContext);
  const [cluster] = useGet(`/api/clusters/${clusterId}`, { onMount: true });
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const[showIframe, setShowIframe] = useState(false);
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setShowIframe(false)
    setTimeout(()=>{
      setShowIframe(true);
    },2000);
    setValue(newValue);
  }
  const handleChangeIndex = (index: number) => {
    setValue(index);
  }
  const isReadOnly = (email !== job['userName']);
  useEffect(()=>{
    let mount = true;
    let timeout: any;
    timeout = setTimeout(()=>{
      setShowIframe(true);
    },2000);
    return () => {
      mount = false;
      clearTimeout(timeout)
    }
  },[])
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [showOpen, setshowOpen] = useState(false)
  const handleWarnClose = () => {
    setshowOpen(false)
  }
  if (isReadOnly) {
    return (
      <Context.Provider value={{ jobId, clusterId, job, cluster }}>
        <DLTSTabs value={value} setValue={setValue} titles={readOnlyJobDetailTitles}  />
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <DLTSTabPanel value={value} index={0} dir={theme.direction}>
            <Container maxWidth={isDesktop ? 'lg' : 'xs'} ><Brief/></Container>
          </DLTSTabPanel>
          <DLTSTabPanel value={value} index={1} dir={theme.direction}>
            { showIframe ? cluster && <Container maxWidth={isDesktop ? 'lg' : 'xs'} ><Monitor/></Container> :  <CircularProgress/>}
          </DLTSTabPanel>
          <DLTSTabPanel value={value} index={2} dir={theme.direction}>
            { job['log'] && <Container maxWidth={isDesktop ? 'lg' : 'xs'} ><Log/></Container> }
          </DLTSTabPanel>
        </SwipeableViews>

      </Context.Provider>
    );
  } else {
    return (
      <Context.Provider value={{ jobId, clusterId, job, cluster }}>
        <DLTSTabs value={value} setValue={setValue} titles={JobDetailTitles} />
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <DLTSTabPanel value={value} index={0} dir={theme.direction}>
            <Container maxWidth={isDesktop ? 'lg' : 'xs'} ><Brief/></Container>
          </DLTSTabPanel>
          <DLTSTabPanel value={value} index={1} dir={theme.direction}>
            {(job['jobStatus'] !== 'pausing' && job['jobStatus'] !== 'paused') &&  <Container maxWidth={isDesktop ? 'lg' : 'xs'} ><Endpoints setOpen={setshowOpen}/></Container>}
          </DLTSTabPanel>
          <DLTSTabPanel value={value} index={2} dir={theme.direction}>
            { showIframe ? cluster && <Container maxWidth={isDesktop ? 'lg' : 'xs'} ><Monitor/></Container> :  <CircularProgress/>}
          </DLTSTabPanel>
          <DLTSTabPanel value={value} index={3} dir={theme.direction}>
            { job['log'] && <Box marginTop={2}><Log/></Box> }
          </DLTSTabPanel>
        </SwipeableViews>
        <DLTSSnackbar message={"Copied"}
          openKillWarn={showOpen}
          handleWarnClose={handleWarnClose}
        />
      </Context.Provider>
    );
  }
};

export default JobDetails;
