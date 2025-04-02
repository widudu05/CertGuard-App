
  exports.header = {
    height: '30mm',
    contents: function(pageNum, numPages) {
      if (pageNum === 1) return '';
      return '<div style="text-align: right; font-size: 10px; color: #666;">CertGuard - Manual do Usuário - Página ' + pageNum + ' de ' + numPages + '</div>';
    }
  };
  
  exports.footer = {
    height: '20mm',
    contents: function(pageNum, numPages) {
      return '<footer>© ' + new Date().getFullYear() + ' CertGuard - Todos os direitos reservados</footer>';
    }
  };
  