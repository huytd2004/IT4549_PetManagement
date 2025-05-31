import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography, Box,
  useTheme, TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { tokens } from "../theme";

const ClassTable = ({ columns, rows, allowSearching, onSearchChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Lấy dữ liệu tìm kiếm
  const [searchValues, setSearchValues] = useState({});

  const handleSearchChange = (value, index) => {
    const column = columns[index];
    const updated = {
      ...searchValues,
      [column.field]: {
        title: column.headerName,
        key: value,
      },
    };
    setSearchValues(updated);
    if (onSearchChange) {
      onSearchChange(updated);
      setPage(0); // Reset về trang đầu nếu tìm kiếm
    } else {
      console.log('Search Data Sent to Backend:', updated[column.field]);
    }
  }
  // ✅ Lọc dữ liệu theo từ khóa
  const filteredRows = useMemo(() => {
    return rows.filter(row =>
      Object.entries(searchValues).every(([field, keyword]) => {
        const cell = row[field];
        return cell?.toString().toLowerCase().includes(keyword.key?.toLowerCase());
      })
    );
  }, [rows, searchValues]);
  // Phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  // ------------------Lấy thông tin phần tick-------------------------------
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected = selectedIds.length === rows.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      console.log([]); //  Bỏ chọn tất cả
    } else {
      const allIds = rows.map(row => row.id);
      setSelectedIds(allIds);
      console.log(rows); // In ra toàn bộ dữ liệu
    }
  };

  const toggleSelectRow = (id) => {
    const isSelected = selectedIds.includes(id);
    let updatedIds;
    if (isSelected) {
      updatedIds = selectedIds.filter(item => item !== id);
    }
    else {
      updatedIds = [...selectedIds, id];
      const rowData = rows.find(row => row.id === id);
      console.log(rowData); //  In ra dữ liệu dòng đó
    }
    setSelectedIds(updatedIds);
  };
  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
        {/* phần bảng */}
        <Table sx={{ tableLayout: "auto", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.primary[400], position: 'sticky', zIndex: '1' }}>
              {columns.map((column, index) => {
                if (column.field === "id") {
                  return (
                    <TableCell className='checkall' key={index} padding="checkbox" sx={{ borderLeft: '1px solid #e0e0e0', gap: '10px', borderBottom: 'none' }}>
                      <Checkbox sx={{ color: colors.greenAccent[500] }} checked={isAllSelected} onChange={toggleSelectAll} />
                    </TableCell>
                  )
                }
                else {
                  return (
                    <TableCell style={{ minWidth: column.minWidth }} sx={{ borderLeft: '1px solid #e0e0e0', padding: '0px 12px', gap: '10px', borderBottom: 'none' }}>
                      <Typography sx={{ fontWeight: '700', fontSize: '13px', lineHeight: '20px', color: colors.greenAccent[500], }}>
                        {column.headerName}
                      </Typography>
                    </TableCell>
                  )
                }
              })}
            </TableRow>
            {/* Hàng tìm kiếm */}
            {allowSearching && (
              <TableRow variant="head"
                sx={{ backgroundColor: colors.primary[400] }}
              >
                {columns.map((column, idx) => {
                  if (column.field === "id") {
                    return (
                      <TableCell key={idx} padding="checkbox" sx={{ borderLeft: '1px solid #e0e0e0', borderTop: 'none' }}>

                      </TableCell>
                    )
                  }
                  if (column.field === "thaoTac") {
                    return (
                      <TableCell sx={{ borderLeft: '1px solid #e0e0e0', padding: '8px 4px 8px 6px', gap: '10px', borderTop: 'none' }}>

                      </TableCell>
                    )
                  }
                  else {
                    return column.disableSearch === 'search' ? (
                      <TableCell key={idx} sx={{ borderLeft: '1px solid #e0e0e0', padding: '8px 4px 8px 6px', gap: '10px', borderTop: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <SearchIcon fontSize="13px" type="submit" />
                          <input
                            type="text"
                            placeholder="Nhập từ khóa"
                            style={{
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              fontSize: '13px',
                              width: '80px'
                            }}
                            onChange={(e) => { handleSearchChange(e.target.value, idx) }}
                          />
                        </Box>
                      </TableCell>
                    ) : (
                      <TableCell key={idx} sx={{ borderLeft: '1px solid #e0e0e0', padding: '8px 4px 8px 6px', gap: '10px', borderTop: 'none' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {/* Không có ô tìm kiếm */}
                        </Box>
                      </TableCell>
                    )

                  }
                })}
              </TableRow>
            )}

          </TableHead>
          {/* <body>
          { columns.map(item) => (
            <div style={minWidth: item.minWidth}>{item.customColumn ? item.customColumn() : <div>{row[item.field]}</div>}</div>
          )}
        </body> */}

          <TableBody >
            {paginatedRows.map((row) => (
              <TableRow key={row.id} hover sx={{ borderLeft: '1px solid #ddd', gap: '10px' }}>
                {columns.map((column, index) => {
                  if (column.field === "id") {
                    return (
                      <TableCell padding="checkbox" key={index} className='checkbox'>
                        <Checkbox
                          checked={selectedIds.includes(row.id)}
                          onChange={() => toggleSelectRow(row.id)}
                        />
                      </TableCell>
                    )

                  }
                  if (column.field === "thaoTac") {
                    return (
                      <TableCell sx={{ borderLeft: '1px solid #e0e0e0', padding: '0px 12px', gap: '10px', borderRight: '1px solid #ddd', textAlign: "center", alignItems: 'center' }}>
                        {column.renderCell ? column.renderCell(row) : null}
                      </TableCell>
                    )
                  }

                  else {
                    return (
                      <TableCell sx={{ borderLeft: '1px solid #e0e0e0', padding: `${column.field === 'id' ? '0px 12px' : '8px'}`, gap: '10px' }}>
                        <Typography sx={{ fontSize: '13px', fontWeight: '400', lineHeight: '20px' }}>{row[column.field]}</Typography>
                      </TableCell>
                    )
                  }
                })
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>

      {/* phân trang */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 15]}
        labelRowsPerPage="Số dòng mỗi trang:"
        sx={{
          '& .MuiTablePagination-toolbar': {
            fontSize: '16px',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '16px',
          },
          '& .MuiInputBase-root': {
            fontSize: '16px',
          },
        }}
      />
    </>

  );
};

export default ClassTable;