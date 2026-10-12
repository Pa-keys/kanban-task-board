import app from '../app.js';
import { AddressInfo } from 'net';

interface TestResult {
  name: string;
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

async function runTests() {
  console.log('\n=============================================');
  console.log('🧪 Starting Kanban REST API Test Suite');
  console.log('=============================================\n');

  // Start app on ephemeral port (port 0 = OS assigns free available port)
  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://localhost:${address.port}`;

  console.log(`📡 Temporary test server running on: ${baseUrl}\n`);

  let createdTaskId: string | null = null;

  try {
    // -------------------------------------------------------------
    // Test 1: Health Check Endpoint
    // -------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      const passed = res.status === 200 && data.status === 'ok';
      results.push({
        name: 'GET /api/health',
        expectedStatus: 200,
        actualStatus: res.status,
        passed,
        details: passed ? 'Server health responded ok' : JSON.stringify(data),
      });
    }

    // -------------------------------------------------------------
    // Test 2: Fetch all initial tasks
    // -------------------------------------------------------------
    {
      const res = await fetch(`${baseUrl}/api/tasks`);
      const body = await res.json();
      const passed = res.status === 200 && Array.isArray(body.data) && body.data.length >= 3;
      results.push({
        name: 'GET /api/tasks (Initial Fetch)',
        expectedStatus: 200,
        actualStatus: res.status,
        passed,
        details: passed ? `Retrieved ${body.data.length} seeded tasks` : JSON.stringify(body),
      });
    }

    // -------------------------------------------------------------
    // Test 3: Create a new valid task
    // -------------------------------------------------------------
    {
      const payload = {
        title: 'Learn REST API Testing',
        description: 'Verify status codes, contracts, and resilience',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      };

      const res = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      const passed = res.status === 201 && body.success && body.data?.id && body.data.title === payload.title;

      if (passed) {
        createdTaskId = body.data.id;
      }

      results.push({
        name: 'POST /api/tasks (Valid Task Creation)',
        expectedStatus: 201,
        actualStatus: res.status,
        passed,
        details: passed ? `Task created with ID: ${createdTaskId}` : JSON.stringify(body),
      });
    }

    // -------------------------------------------------------------
    // Test 4: Reject invalid task creation (Defensive check)
    // -------------------------------------------------------------
    {
      const invalidPayload = { description: 'Missing title property' };
      const res = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });
      const body = await res.json();
      const passed = res.status === 400 && body.success === false;

      results.push({
        name: 'POST /api/tasks (Validation: Missing Title)',
        expectedStatus: 400,
        actualStatus: res.status,
        passed,
        details: passed ? `Correctly rejected: "${body.message}"` : JSON.stringify(body),
      });
    }

    // -------------------------------------------------------------
    // Test 5: Update the created task (Move to DONE)
    // -------------------------------------------------------------
    if (createdTaskId) {
      const updatePayload = { status: 'DONE' };
      const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success && body.data.status === 'DONE';

      results.push({
        name: 'PUT /api/tasks/:id (Move Task to DONE)',
        expectedStatus: 200,
        actualStatus: res.status,
        passed,
        details: passed ? 'Status successfully updated to DONE' : JSON.stringify(body),
      });
    }

    // -------------------------------------------------------------
    // Test 6: Delete the task
    // -------------------------------------------------------------
    if (createdTaskId) {
      const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
        method: 'DELETE',
      });
      const body = await res.json();
      const passed = res.status === 200 && body.success;

      results.push({
        name: 'DELETE /api/tasks/:id (Remove Task)',
        expectedStatus: 200,
        actualStatus: res.status,
        passed,
        details: passed ? 'Task successfully deleted' : JSON.stringify(body),
      });
    }

    // -------------------------------------------------------------
    // Test 7: Confirm deleted task returns 404
    // -------------------------------------------------------------
    if (createdTaskId) {
      const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`);
      const body = await res.json();
      const passed = res.status === 404 && body.success === false;

      results.push({
        name: 'GET /api/tasks/:id (Confirm 404 on deleted task)',
        expectedStatus: 404,
        actualStatus: res.status,
        passed,
        details: passed ? 'Correctly returned 404 Not Found' : JSON.stringify(body),
      });
    }
  } finally {
    // Always close server cleanly so no processes hang
    server.close();
  }

  // -------------------------------------------------------------
  // Display Test Report
  // -------------------------------------------------------------
  console.log('-------------------------------------------------------------');
  console.log('📋 Test Execution Summary:');
  console.log('-------------------------------------------------------------');

  let allPassed = true;
  for (const r of results) {
    const symbol = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`${symbol} | ${r.name}`);
    console.log(`         Status: ${r.actualStatus} (Expected: ${r.expectedStatus}) | Note: ${r.details}`);
  }

  console.log('-------------------------------------------------------------');
  if (allPassed) {
    console.log('🎉 ALL 7 TESTS PASSED! API contract is verified and resilient.');
  } else {
    console.error('⚠️ Some tests failed. Please review error outputs.');
    process.exitCode = 1;
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
