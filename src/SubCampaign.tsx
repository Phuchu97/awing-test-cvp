import { Ads, SubCampaign } from "./interfaces"
import DoneIcon from '@mui/icons-material/Done';
import { Box, Grid, Paper, Typography } from "@mui/material"

export default function SubCampaignComponent(
    { subCampaign, listSubcampaign, handleSelectSubCampaign } :
    { subCampaign: SubCampaign, listSubcampaign: SubCampaign[], handleSelectSubCampaign: any }
) {
    return (
        <Grid container>
            {
                listSubcampaign.map((item: SubCampaign, key: number) => {
                    return (
                        <Grid item xs={4} md={3} key={key} marginBottom={'12px'} >
                            <Paper
                                style={{
                                    width: '210px',
                                    height: '120px',
                                    marginLeft: '16px',
                                    cursor: 'pointer',
                                }}
                                className={`${item.id === subCampaign.id ? "campaign-tab-active" : ""}`}
                                elevation={1}
                                component={'div'}
                                onClick={() => handleSelectSubCampaign(item.id)}
                            >
                                <Box>
                                    <Typography
                                        variant='h6'
                                        textAlign={'center'}
                                        style={{
                                            padding: '8px 8px 4px',
                                            color: 'inherit',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-all'
                                        }}
                                        className={`${item.isError ? "color-error" : ""}`}
                                    >
                                        {item.name}
                                        <DoneIcon
                                            className={`${item.status ? "status-icon-active" : "status-icon-not-active"}`}
                                            style={{ fontSize: '12px', color: '#fff', marginLeft: '8px', padding: '0.5px', borderRadius: '50%' }}
                                        />
                                    </Typography>

                                </Box>
                                <Typography variant='h5' textAlign={'center'} style={{ padding: '0px 8px' }}>
                                    {item.ads.reduce((total: number, cur: Ads) => total + Number(cur.quantity), 0)}
                                </Typography>
                            </Paper>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}