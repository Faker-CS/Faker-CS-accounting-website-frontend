import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetEmployee } from 'src/actions/employee';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { EmployeeShowView } from 'src/sections/users/employee/view/employee-show-view';

// ----------------------------------------------------------------------

const metadata = { title: `Employee Details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    const { id = '' } = useParams();

    const {employeeData, employeeLoading, employeeError} = useGetEmployee(id);
    
    if (employeeLoading) {
        return <LoadingScreen />;
    }
    
    if (employeeError) {
      return (
        <Container sx={{ my: 5 }}>
          <EmptyContent title="Employee not found" />
        </Container>
      );
    }
    
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeShowView 
        currentUser={employeeData}
      />
    </>
  );
}
