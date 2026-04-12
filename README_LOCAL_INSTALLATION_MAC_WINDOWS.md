# Local Installation Guide (Windows & Mac)

This guide explains how to set up the local development environment for working on GymTracker, including Budibase, the frontend-related tooling, and the Python backend.

## Required Software

* Docker Desktop
* Node.js (LTS)
* Budibase CLI

---

## Windows Setup

### 1. Install Docker Desktop

Download:
`https://docs.docker.com/desktop/`

1. Download Docker Desktop for Windows.
2. Run the installer.
3. Keep the **default settings** during installation.
4. Start Docker Desktop after installation.

### 2. Install Node.js

Download:
`https://nodejs.org/en/download`

1. Download Node.js.
2. Select the **LTS version** for **Windows**.
3. Run the installer.
4. Keep the **default settings** during installation.

### 3. Install Budibase CLI

Budibase was installed locally through the terminal using the Budibase CLI.

Run:

```bash
npm install -g @budibase/cli
```

Then initialize Budibase:

```bash
budi hosting --init
```

### 4. Verify Installation

Open PowerShell or Command Prompt and run:

```bash
docker --version
node -v
npm -v
budi --version
```

### 5. Start and Stop Budibase

Use:

```bash
budi hosting --start
budi hosting --stop
```

Budibase runs locally on **port 10000** in my setup, but this can be changed if needed.

### 6. Start GymTracker Backend

Run:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001
```

GymTracker runs locally on **port 8001** in my setup, but this can also be changed if needed.

---

## Mac Setup

### 1. Install Docker Desktop

Download:
`https://docs.docker.com/desktop/`

1. Download Docker Desktop for macOS.
2. Choose the correct version:

   * Apple Silicon for M1 / M2 / M3
   * Intel for older MacBooks
3. Run the installer.
4. Keep the **default settings** during installation.
5. Start Docker Desktop after installation.

### 2. Install Node.js

Download:
`https://nodejs.org/en/download`

1. Download Node.js.
2. Select the **LTS version** for your operating system.
3. Run the installer.
4. Keep the **default settings** during installation.

### 3. Install Budibase CLI

Budibase was installed locally through the terminal using the Budibase CLI.

Run:

```bash
npm install -g @budibase/cli
```

Then initialize Budibase:

```bash
budi hosting --init
```

### 4. Verify Installation

Open Terminal and run:

```bash
docker --version
node -v
npm -v
budi --version
```

### 5. Start and Stop Budibase

Use:

```bash
budi hosting --start
budi hosting --stop
```

Budibase runs locally on **port 10000** in my setup, but this can be changed if needed.

### 6. Start GymTracker Backend

Run:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001
```

GymTracker runs locally on **port 8001** in my setup, but this can also be changed if needed.

---

## Notes

In our setup, no special installation options were required.
For Docker Desktop and Node.js, it was enough to go through the installer and keep the **default settings**.

---

## Quick Summary

1. Install Docker Desktop
2. Install Node.js (LTS)
3. Install Budibase CLI
4. Run `budi hosting --init`
5. Start Budibase with `budi hosting --start`
6. Stop Budibase with `budi hosting --stop`
7. Start GymTracker with
   `python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001`
