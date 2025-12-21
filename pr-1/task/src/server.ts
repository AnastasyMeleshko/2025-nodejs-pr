import http, { IncomingMessage, ServerResponse } from 'http';
import { createTestStudents } from './initData';
import url from 'url';
import {
  addStudent,
  getAllStudents,
  loadStudents,
  getPlainStudents,
  getStudentById,
  removeStudent,
  getStudentsByGroup,
  calculateAverageAge
} from './services/studentService';
import { saveToJSON, loadJSON } from './services/storage';
import BackupService from './services/backupService';

// Logger
function logger(msg: string, type: string = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${msg}`);
}

// Initialize students
async function initStudents() {
  const data = await loadJSON();
  loadStudents(data);
  logger(`Loaded ${getAllStudents().length} students`);
}

initStudents();

async function init() {
  await initStudents();
  if ((await loadJSON()).length === 0) {
    console.log('No students found, creating test students...');
    await createTestStudents();
    await initStudents(); // upload students after creation
  }
}

init();


// Backup service
const backupService = new BackupService(getPlainStudents, { intervalMs: 10000, logger });

// HTTP server
const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = url.parse(req.url ?? '', true);
  const method = req.method ?? '';
  const pathname = parsedUrl.pathname ?? '';

  res.setHeader('Content-Type', 'application/json');

  // Root
  if (pathname === '/' && method === 'GET') {
    res.writeHead(200);
    return res.end(JSON.stringify({ message: 'Hello, Student Management System! Use /api/students or /api/backup' }));
  }

  // --- STUDENTS API ---
  if (pathname.startsWith('/api/students')) {
    try {
      if (pathname === '/api/students' && method === 'GET') {
        return res.end(JSON.stringify(getAllStudents()));
      }

      const studentIdMatch = pathname.match(/^\/api\/students\/([^/]+)$/);
      if (studentIdMatch && method === 'GET') {
        const student = getStudentById(studentIdMatch[1]);
        return res.end(JSON.stringify(student || { error: 'Student not found' }));
      }

      const groupMatch = pathname.match(/^\/api\/students\/group\/([^/]+)$/);
      if (groupMatch && method === 'GET') {
        return res.end(JSON.stringify(getStudentsByGroup(groupMatch[1])));
      }

      if (pathname === '/api/students/average-age' && method === 'GET') {
        return res.end(JSON.stringify({ averageAge: calculateAverageAge() }));
      }

      if (pathname === '/api/students' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const obj = JSON.parse(body);
            const student = addStudent(obj);
            saveToJSON(getPlainStudents());
            return res.end(JSON.stringify(student));
          } catch (err) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      if (pathname === '/api/students' && method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const arr = JSON.parse(body);
            if (!Array.isArray(arr)) throw new Error('Expected array');
            loadStudents(arr);
            saveToJSON(getPlainStudents());
            return res.end(JSON.stringify(getAllStudents()));
          } catch (err: any) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }

      if (studentIdMatch && method === 'DELETE') {
        const removed = removeStudent(studentIdMatch[1]);
        saveToJSON(getPlainStudents());
        return res.end(JSON.stringify({ removed }));
      }

      res.writeHead(404);
      return res.end(JSON.stringify({ error: 'Student endpoint not found' }));
    } catch (err: any) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // --- BACKUP API ---
  if (pathname.startsWith('/api/backup')) {
    try {
      if (pathname === '/api/backup/start' && method === 'POST') {
        backupService.start();
        return res.end(JSON.stringify({ status: 'Backup started' }));
      }
      if (pathname === '/api/backup/stop' && method === 'POST') {
        backupService.stop();
        return res.end(JSON.stringify({ status: 'Backup stopped' }));
      }
      if (pathname === '/api/backup/status' && method === 'GET') {
        return res.end(JSON.stringify({ running: backupService.status() }));
      }
      res.writeHead(404);
      return res.end(JSON.stringify({ error: 'Backup endpoint not found' }));
    } catch (err: any) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // Not found
  res.writeHead(404);
  return res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
const PORT = 3000;
server.listen(PORT, () => logger(`Server running at http://localhost:${PORT}`));
