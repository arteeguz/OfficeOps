import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

function ImportExport() {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [mappings, setMappings] = useState({});
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      analyzeFile(selectedFile);
    }
  };

  const analyzeFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFileInfo(response.data);
      setMappings(response.data.suggestedMappings);
      toast.success('File analyzed successfully');
    } catch (error) {
      toast.error('Error analyzing file');
      setFile(null);
    }
  };

  const handleMappingChange = (excelColumn, dbField) => {
    setMappings({
      ...mappings,
      [excelColumn]: dbField
    });
  };

  const handleImport = async () => {
    if (!fileInfo) return;

    setImporting(true);
    try {
      const response = await api.post('/import/execute', {
        fileId: fileInfo.fileId,
        mappings
      });
      
      const { results } = response.data;
      toast.success(
        `Import completed! Success: ${results.successCount}, Failed: ${results.failedCount}`
      );
      
      // Reset form
      setFile(null);
      setFileInfo(null);
      setMappings({});
    } catch (error) {
      toast.error('Error importing data');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/import/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `office_space_export_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Export completed');
    } catch (error) {
      toast.error('Error exporting data');
    }
  };

  const dbFields = [
    { value: 'seatId', label: 'Seat ID' },
    { value: 'building', label: 'Building' },
    { value: 'floor', label: 'Floor' },
    { value: 'status', label: 'Status' },
    { value: 'employeeNumber', label: 'Employee Number' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'businessGroup', label: 'Business Group' },
    { value: 'department', label: 'Department' }
  ];

  return (
    <div>
      <h1>Import/Export Data</h1>
      
      <div className="card">
        <div className="card-header">
          <h2>Export Current Data</h2>
        </div>
        <p style={{ marginBottom: '1.5rem' }}>
          Download the current office space data as an Excel file for reporting or backup purposes.
        </p>
        <button className="btn btn-accent" onClick={handleExport}>
          📥 Export to Excel
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Import Data from Excel</h2>
        </div>
        
        <div className="form-group">
          <label>Select Excel File (.xlsx or .xls)</label>
          <input 
            type="file" 
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="form-control"
            style={{ padding: '0.5rem' }}
          />
        </div>

        {fileInfo && (
          <>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#E6F2FA', 
              borderRadius: '4px',
              marginBottom: '1.5rem' 
            }}>
              <p style={{ margin: '0.5rem 0' }}><strong>File:</strong> {file.name}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Total Rows:</strong> {fileInfo.totalRows}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Columns Found:</strong> {fileInfo.headers.join(', ')}</p>
            </div>

            <h3>Column Mapping Configuration</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--rbc-gray)' }}>
              Map your Excel columns to the corresponding database fields
            </p>
            
            <div style={{ 
              display: 'grid', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              {fileInfo.headers.map(header => (
                <div key={header} className="form-group">
                  <label>{header}</label>
                  <select 
                    className="form-control"
                    value={mappings[header] || ''}
                    onChange={(e) => handleMappingChange(header, e.target.value)}
                  >
                    <option value="">-- Skip this column --</option>
                    {dbFields.map(field => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleImport}
              disabled={importing || Object.keys(mappings).length === 0}
            >
              {importing ? 'Importing Data...' : 'Start Import'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImportExport;
