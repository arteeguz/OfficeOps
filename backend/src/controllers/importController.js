const excelService = require('../services/excelService');
const fs = require('fs').promises;

exports.analyzeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const { headers, data } = await excelService.parseExcelFile(req.file.path);
    const suggestedMappings = await excelService.detectMappings(headers);
    
    // Store file info in session for later use
    const fileInfo = {
      path: req.file.path,
      headers,
      sampleData: data.slice(0, 5),
      totalRows: data.length
    };
    
    res.json({
      success: true,
      headers,
      sampleData: data.slice(0, 5),
      totalRows: data.length,
      suggestedMappings,
      fileId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.executeImport = async (req, res) => {
  try {
    const { fileId, mappings } = req.body;
    const filePath = `uploads/${fileId}`;
    
    const { data } = await excelService.parseExcelFile(filePath);
    const results = await excelService.importData(data, mappings);
    
    // Clean up uploaded file
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      results: {
        totalProcessed: data.length,
        successCount: results.success.length,
        failedCount: results.failed.length,
        conflicts: results.conflicts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const workbook = await excelService.exportToExcel();
    const fileName = `office_space_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
