
import { tokens } from "../../theme";
import Breadcrumb from "../../components/BreadCrumb";
import { Box, Typography, useTheme, Stepper, Step, StepLabel } from "@mui/material";
import { useState } from "react";
import Step1Register from "./Step1Register";
import Step2Payment from "./Step2Payment";
import Step3Receipt from "./Step3Receipt";
const ServiceRegister = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const breadcrumbItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Dịch vụ/đăng ký', path: null }
    ];
    const steps = ['Đăng ký dịch vụ', 'Thanh toán', 'Phiếu dịch vụ'];
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <Box m="5px 20px">
                <Typography textAlign="center" variant="h2" color={colors.greenAccent[400]}>Đăng ký dịch vụ</Typography>
            </Box>

            <Box width="100%" m="5px">
                <Stepper activeStep={activeStep} sx={{ mb: 3,mt:3,mr:3 }}>
                    {steps.map((label) => (
                        <Step key={label}
                            sx={{
                                '& .MuiStepIcon-text':{
                                    fontSize:"14px",
                                }
                            }}
                        >
                            <StepLabel 
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        fontSize: '14px',
                                    },
                                    }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ p: 4 }}>
                    {activeStep === 0 && (
                        <Step1Register formData={formData} setFormData={setFormData} onNext={handleNext} />
                    )}
                    {activeStep === 1 && (
                        <Step2Payment formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
                    )}
                    {activeStep === 2 && <Step3Receipt formData={formData} />}
                </Box>
            </Box>
        </>
    )
}
export default ServiceRegister;