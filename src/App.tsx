import './App.css';
import React, { useState } from 'react';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import AddIcon from '@mui/icons-material/Add';
import SubCampaignComponent from './SubCampaign';
import DeleteIcon from '@mui/icons-material/Delete';
import { Ads, SubCampaign, dataSubmit } from './interfaces';
import { TableHead, TableBody, TableRow, TableCell, FormHelperText } from '@mui/material';
import { Grid, Box, Typography, Button, Tab, TextField, IconButton, Checkbox, FormControlLabel, Table, FormControl } from '@mui/material';

function App() {
  const initialValue: SubCampaign[] = [{ id: 1, isError: false, name: 'Chiến dịch con 1', status: true, ads: [{ id: 1, name: 'Quảng cáo 1', quantity: 0 }] }];
  const [value, setValue] = React.useState('1');
  const [listSubcampaign, setListSubcampaign] = useState<SubCampaign[]>(initialValue);
  const [subCampaign, setSubCampaign] = useState<SubCampaign>(listSubcampaign[0]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < subCampaign.ads.length;
  const [inforDescription, setInforDescription] = useState<String>('');
  const [inforName, setInforName] = useState<String>('');
  const [isSubmit, setIsSubmit] = useState<Boolean>(false);

  // Chuyển tab chính
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Chuyển tab trong Subcampaign
  const handleSelectSubCampaign = async (id: number) => {
    setListSubcampaign((prevList) =>
      prevList.map((sub) => sub.id === subCampaign.id ? subCampaign : sub)
    );
    const newSubCampaign = listSubcampaign.filter(item => item.id === id)[0];
    setSubCampaign(newSubCampaign);
  };

  // Thêm 1 SubCampaign
  const handleAddSubCampaign = () => {
    const idSubAdd: number = listSubcampaign.length + 1;
    const subCampaignAdd: SubCampaign = isSubmit ?
      { id: idSubAdd, isError: true, name: `Chiến dịch con ${idSubAdd}`, status: true, ads: [{ id: 1, name: 'Quảng cáo 1', quantity: 0 }] } :
      { id: idSubAdd, isError: false, name: `Chiến dịch con ${idSubAdd}`, status: true, ads: [{ id: 1, name: 'Quảng cáo 1', quantity: 0 }] };
    setListSubcampaign(prev => {
      const newList = prev.map((sub) => {
        if (sub.id === subCampaign.id) {
          const checkAds = sub.ads.find((item) => item.name == '' || item.quantity == 0);
          return (isSubmit && (sub.name == '' || checkAds || sub.ads.length == 0))? { ...subCampaign, isError: true } : subCampaign;
        }
        return sub;
      });
      return [...newList, subCampaignAdd];
    });
    setSubCampaign(subCampaignAdd);
  };

  //Chọn tất cả các Ads
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allRowIds = subCampaign.ads.map((row) => row.id);
    setSelectedRows(selectAll ? [] : allRowIds);
  };

  // Chọn 1 Ads
  const handleSelectRow = (id: number) => {
    const isSelected = selectedRows.includes(id);
    const newSelectedRows = isSelected
      ? selectedRows.filter((selectedId) => selectedId !== id)
      : [...selectedRows, id];
    setSelectAll(newSelectedRows.length === subCampaign.ads.length);
    setSelectedRows(newSelectedRows);
  };

  // Xóa nhiều Ads
  const handleDeleteSelectedRows = () => {
    const newData = subCampaign.ads.filter((row) => !selectedRows.includes(row.id));
    const checkAds = newData.find((item: Ads) => item.name == '' || item.quantity == 0);
    if (isSubmit) {
      setSubCampaign((prev) => checkAds || newData.length == 0 ? { ...prev, isError: true, ads: newData } : { ...prev, isError: false, ads: newData });
      setListSubcampaign((prevList) =>
        prevList.map((sub) => sub.id === subCampaign.id ? (checkAds || newData.length == 0 ? { ...sub, isError: true, ads: newData } : { ...sub, isError: false, ads: newData }) : sub)
      );
    } else {
      setSubCampaign({ ...subCampaign, ads: newData });
    }
    setSelectAll(false);
    setSelectedRows([]);
  };

  // Xóa 1 Ads
  const handleDeleteRow = (id: number) => {
    const newData = subCampaign.ads.filter((item) => item.id !== id);
    const checkAds = newData.find((item: Ads) => item.name == '' || item.quantity == 0);
    if (isSubmit) {
      setSubCampaign((prev) => checkAds || newData.length == 0 ? { ...prev, isError: true, ads: newData } : { ...prev, isError: false, ads: newData });
      setListSubcampaign((prevList) =>
        prevList.map((sub) => sub.id === subCampaign.id ? (checkAds || newData.length == 0 ? { ...sub, isError: true, ads: newData } : { ...sub, isError: false, ads: newData }) : sub)
      );
    } else {
      setSubCampaign({ ...subCampaign, ads: newData });
    }
    setSelectAll(false);
    setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((selectedId) => selectedId !== id));
  };

  // Thêm 1 Ads
  const handleAddRow = () => {
    const newRow: Ads = { id: subCampaign.ads.length + 1, name: `Quảng cáo ${subCampaign.ads.length + 1}`, quantity: 0 };
    if (isSubmit) {
      setSubCampaign({ ...subCampaign, isError: true, ads: [...subCampaign.ads, newRow] });
      setListSubcampaign((prevList) =>
        prevList.map((sub) => sub.id === subCampaign.id ? { ...subCampaign, isError: true } : sub)
      );
    } else {
      setSubCampaign({ ...subCampaign, ads: [...subCampaign.ads, newRow] });
    }
  };

  // Thay đổi trạng thái hoạt động
  const handleCheckedStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubCampaign((prevData) => { return { ...prevData, status: e.target.checked }; });
    setListSubcampaign((prevList) =>
      prevList.map((sub) => sub.id === subCampaign.id ? { ...subCampaign, status: e.target.checked } : sub)
    );
  };

  // Xử lý tên SubCampaign
  const handleChangeSubCampaignName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCampaign((prevData) => { return { ...prevData, name: value }; })
    if (isSubmit) {
      setListSubcampaign((prevList) =>
        prevList.map((sub) => sub.id === subCampaign.id ? (value === '' ? { ...subCampaign, isError: true } : { ...subCampaign, isError: false }) : sub)
      );
    } else {
      setListSubcampaign((prevList) =>
        prevList.map((sub) => sub.id === subCampaign.id ? { ...subCampaign, name: value } : sub)
      );
    }
  };

  // Xử lý name và quantity của Ads 
  const handleChangeAds = (id: number, e: React.ChangeEvent<HTMLInputElement>, type: String) => {
    const value = e.target.value;
    const updatedAds: Ads[] = type == 'quantity' ? subCampaign.ads.map((item) => item.id === id ? { ...item, quantity: Number(value) } : item) :
      subCampaign.ads.map((item) => item.id === id ? { ...item, name: value } : item);
    const checkAds = updatedAds.find((item: Ads) => item.name == '' || item.quantity == 0);
    if (isSubmit) {
      setSubCampaign((prevData) => {
        return checkAds ? { ...prevData, isError: true, ads: updatedAds } : { ...prevData, isError: false, ads: updatedAds };
      });
      setListSubcampaign((prevList) =>
        prevList.map((sub) => {
          if (sub.id === subCampaign.id) {
            return checkAds ? { ...subCampaign, isError: true, ads: updatedAds } : { ...subCampaign, isError: false, ads: updatedAds };
          } else {
            return sub;
          }
        }));
    } else {
      setSubCampaign((prevData) => {
        return { ...prevData, ads: updatedAds };
      });
      setListSubcampaign((prevList) =>
        prevList.map((sub) => sub.id === subCampaign.id ? { ...subCampaign, ads: updatedAds } : sub)
      );
    }
  };

  // Xử lý Submit
  const handlesubmit = () => {
    setIsSubmit(true);
    let isError = false;
    let dataSubmit: dataSubmit = {
      information: {
        name: inforName,
        describe: inforDescription
      },
      subCampaigns: listSubcampaign
    }
    if (inforName == '') {
      isError = true;
    }
    const newListSubcampaign = listSubcampaign.map((sub) => {
      const checkAds = sub.ads.find((item) => item.name == '' || item.quantity == 0);
      if (sub.name == '' || checkAds || sub.ads.length == 0) {
        isError = true;
        return { ...sub, isError: true };
      }
      return { ...sub, isError: false };
    })
    setListSubcampaign(newListSubcampaign);
    isError ? alert('Vui lòng điền đầy đủ thông tin!') : alert(`Thêm thành công chiến dịch : ${JSON.stringify(dataSubmit)}`);
  };

  return (
    <Grid className="App">
      <Grid style={{ paddingTop: '20px' }}>
        <Box display={'flex'} justifyContent={'end'} alignItems={'center'} style={{ borderBottom: '1px solid gray', padding: '10px 20px' }}>
          <Button onClick={handlesubmit} color='primary' variant="contained">
            Submit
          </Button>
        </Box>
      </Grid>
      <Box style={{ margin: '24px', boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)' }}>
        <TabContext value={value}>
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider'
          }}
          >
            <TabList onChange={handleChangeTab} aria-label="lab API tabs">
              <Tab label="Thông tin" value="1" />
              <Tab label="Chiến dịch con" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" style={{ textAlign: 'start' }}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                id="filled-basic"
                label="Tên chiến dịch*"
                type="text"
                variant="filled"
                className='information-input'
                style={{ margin: '8px' }}
                value={inforName}
                error={(isSubmit == true && inforName == '') ? true : false}
                onChange={(e) => setInforName(e.target.value)}
              />
              {(isSubmit == true && inforName == '') && <FormHelperText className='color-error'>Dữ liệu không hợp lệ</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                fullWidth
                id="filled-basic"
                className='information-input'
                variant="filled"
                type="text"
                label="Mô tả"
                style={{ margin: '8px' }}
                value={inforDescription}
                onChange={(e) => setInforDescription(e.target.value)}
              />
            </FormControl>
          </TabPanel>
          <TabPanel value="2">
            <Grid display={'flex'} style={{ width: '968px' }}>
              <Box>
                <IconButton onClick={handleAddSubCampaign} aria-label="delete" size="small" style={{ backgroundColor: 'rgb(237, 237, 237)', padding: '12px', color: '#f50057' }}>
                  <AddIcon fontSize="inherit" style={{ width: '1em', height: '1em', fontSize: '1.5rem' }} />
                </IconButton>
              </Box>
              <SubCampaignComponent subCampaign={subCampaign} handleSelectSubCampaign={handleSelectSubCampaign} listSubcampaign={listSubcampaign} />
            </Grid>
            <Grid container >
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Tên chiến dịch con*"
                    type="text"
                    value={subCampaign.name}
                    variant="filled"
                    className='information-input'
                    style={{ margin: '8px' }}
                    error={(isSubmit == true && subCampaign.name == '') ? true : false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleChangeSubCampaignName(e) }}
                  />
                  {(isSubmit == true && subCampaign.name == '') && <FormHelperText className='color-error'>Dữ liệu không hợp lệ</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={subCampaign.status}
                      onChange={(e) => handleCheckedStatus(e)}
                    />
                  }
                  label="Đang hoạt động"
                />
              </Grid>
            </Grid>
            <Grid>
              <Typography variant='h6' style={{ padding: '16px', textAlign: 'left', marginTop: '16px' }}>DANH SÁCH QUẢNG CÁO</Typography>
            </Grid>
            <Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        indeterminate={isIndeterminate}
                      />
                    </TableCell>
                    <TableCell>{selectedRows.length > 0 ? (
                      <IconButton onClick={handleDeleteSelectedRows}>
                        <DeleteIcon />
                      </IconButton>
                    ) : 'Tên quảng cáo*'}</TableCell>
                    <TableCell>{selectedRows.length == 0 && 'Số lượng*'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={handleAddRow}>
                        +Thêm
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subCampaign.ads.map((row) => (
                    <TableRow key={row.id} style={{
                      backgroundColor: selectedRows.includes(row.id)
                        ? '#feebf2'
                        : ''
                    }}>
                      <TableCell style={{ width: '5%' }}>
                        <Checkbox checked={selectedRows.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="text"
                          fullWidth
                          id="filled-basic"
                          className={`${selectedRows.includes(row.id) ? 'information-input-selected' : 'information-input'}`}
                          style={{ backgroundColor: selectedRows.includes(row.id) ? '#feebf2' : '' }}
                          variant="filled"
                          value={row.name}
                          error={(isSubmit == true && row.name == '') ? true : false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleChangeAds(row.id, e, 'name') }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          id="filled-basic"
                          className={`${selectedRows.includes(row.id) ? 'information-input-selected' : 'information-input'}`}
                          variant="filled"
                          type="number"
                          error={(isSubmit == true && row.quantity == 0) ? true : false}
                          value={row.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleChangeAds(row.id, e, 'quantity') }}
                        />
                      </TableCell>
                      <TableCell width={'8%'} style={{ textAlign: 'end' }}>
                        <IconButton onClick={() => handleDeleteRow(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </TabPanel>
        </TabContext>
      </Box>
    </Grid>
  );
}

export default App;
