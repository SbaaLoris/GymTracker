// ComponentsPage — comprehensive showcase of every shadcn primitive available in the kit.
// Use this page to copy-paste patterns into real Mova flows.

function ComponentsPage({ navigate, auth }) {
  return (
    <AppLayout route="/components" navigate={navigate} auth={auth}>
      <PageHeader
        title="Components"
        description="The full shadcn primitive set, themed for Mova. Compose these into product flows."
      />

      <div className="components-stack">

        {/* ===== Tabs ===== */}
        <ComponentSection eyebrow="NAVIGATION" title="Tabs" desc="Section-level switching for dashboards and settings.">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="prs">Personal Records</TabsTrigger>
            </TabsList>
            <TabsContent value="overview"><p className="text-muted">Stats, body weight, recent sessions live here.</p></TabsContent>
            <TabsContent value="history"><p className="text-muted">Past sessions, filterable by date.</p></TabsContent>
            <TabsContent value="prs"><p className="text-muted">Highest weight lifted per exercise.</p></TabsContent>
          </Tabs>
        </ComponentSection>

        {/* ===== Breadcrumb + Pagination ===== */}
        <ComponentSection eyebrow="NAVIGATION" title="Breadcrumb" desc="Path indicator for deep nav, e.g. inside Plans / Leg Day A / Edit.">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#" onClick={(e)=>e.preventDefault()}>Plans</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator/>
              <BreadcrumbItem><BreadcrumbLink href="#" onClick={(e)=>e.preventDefault()}>Leg Day A</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator/>
              <BreadcrumbItem><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </ComponentSection>

        <ComponentSection eyebrow="NAVIGATION" title="Pagination" desc="For long exercise libraries or session history.">
          <PaginationDemo/>
        </ComponentSection>

        {/* ===== Form Controls ===== */}
        <ComponentSection eyebrow="FORMS" title="Select" desc="SelectItem inside SelectGroup. Always.">
          <div style={{ maxWidth: 280 }}>
            <Field>
              <FieldLabel>Muscle group</FieldLabel>
              <SelectDemo/>
            </Field>
          </div>
        </ComponentSection>

        <ComponentSection eyebrow="FORMS" title="Checkbox · Switch · Radio" desc="The standard binary + grouped option controls.">
          <ControlsDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FORMS" title="ToggleGroup" desc="Segmented control. Use for 2–7 mutually-exclusive options (filters, date range, units).">
          <ToggleGroupDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FORMS" title="Slider" desc="Cardio intensity, target RPE, rest timer length.">
          <SliderDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FORMS" title="Textarea" desc="Exercise notes, request reasons.">
          <div style={{ maxWidth: 480 }}>
            <Field>
              <FieldLabel>Notes</FieldLabel>
              <Textarea placeholder="How did the session feel? Any niggles?" defaultValue="Felt strong on squats. Knees were stiff during warm-up — added 10 extra mobility minutes."/>
            </Field>
          </div>
        </ComponentSection>

        <ComponentSection eyebrow="FORMS" title="InputGroup" desc="Inline addons — leading icon, trailing unit, embedded button.">
          <InputGroupDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FORMS" title="Field validation" desc="data-invalid on Field, aria-invalid on the control.">
          <div style={{ maxWidth: 320 }}>
            <Field data-invalid>
              <FieldLabel htmlFor="vbr-email">Email</FieldLabel>
              <Input id="vbr-email" type="email" aria-invalid defaultValue="not-an-email"/>
              <FieldError>Enter a valid email address.</FieldError>
            </Field>
          </div>
        </ComponentSection>

        {/* ===== Data display ===== */}
        <ComponentSection eyebrow="DATA" title="Table" desc="Personal records table — semantic, sortable in production.">
          <TableDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="DATA" title="Avatar" desc="AvatarFallback is required for accessibility.">
          <AvatarDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="DATA" title="Accordion" desc="Reveal-on-demand details, like exercises inside a plan.">
          <AccordionDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="DATA" title="Progress" desc="Weekly goal, plan completion, upload progress.">
          <ProgressDemo/>
        </ComponentSection>

        {/* ===== Overlays ===== */}
        <ComponentSection eyebrow="OVERLAYS" title="Dialog" desc="Form modals (rename plan, add exercise). DialogTitle is required.">
          <DialogDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="OVERLAYS" title="AlertDialog" desc="Destructive confirmations only (delete plan, sign out).">
          <AlertDialogDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="OVERLAYS" title="Sheet" desc="Side panel for exercise details, edit forms.">
          <SheetDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="OVERLAYS" title="Drawer" desc="Bottom sheet for mobile workout logger and quick actions.">
          <DrawerDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="OVERLAYS" title="Tooltip · Popover · HoverCard" desc="Hover hints, filter popovers, user previews.">
          <HoverDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="OVERLAYS" title="DropdownMenu" desc="Row overflow actions. Items live inside Groups.">
          <DropdownDemo/>
        </ComponentSection>

        {/* ===== Feedback ===== */}
        <ComponentSection eyebrow="FEEDBACK" title="Alert" desc="Inline non-dismissible callouts.">
          <AlertDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FEEDBACK" title="Empty state" desc="No workouts yet, no results, etc.">
          <EmptyDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FEEDBACK" title="Toast" desc="Sonner-style. Use toast.success / toast.error / toast.info.">
          <ToastDemo/>
        </ComponentSection>

        <ComponentSection eyebrow="FEEDBACK" title="Skeleton · Spinner" desc="Loading shapes for content, spinner for buttons & inline.">
          <LoadingDemo/>
        </ComponentSection>

      </div>
    </AppLayout>
  );
}

function ComponentSection({ eyebrow, title, desc, children }) {
  return (
    <section className="component-section">
      <div className="component-section__head">
        <div className="component-section__eyebrow">{eyebrow}</div>
        <div className="component-section__title">{title}</div>
        {desc && <div className="component-section__desc">{desc}</div>}
      </div>
      <div className="component-section__body">{children}</div>
    </section>
  );
}

// ---------------- Demo blocks ----------------

function PaginationDemo() {
  const [page, setPage] = React.useState(2);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))}/></PaginationItem>
        {[1, 2, 3].map(n => <PaginationItem key={n}><PaginationLink isActive={page === n} onClick={() => setPage(n)}>{n}</PaginationLink></PaginationItem>)}
        <PaginationItem><PaginationEllipsis/></PaginationItem>
        <PaginationItem><PaginationLink onClick={() => setPage(12)}>12</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext onClick={() => setPage(Math.min(12, page + 1))}/></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function SelectDemo() {
  const [v, setV] = React.useState("");
  return (
    <Select value={v} onValueChange={setV}>
      <SelectTrigger><SelectValue placeholder="Pick a muscle group"/></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Upper body</SelectLabel>
          <SelectItem value="chest">Chest</SelectItem>
          <SelectItem value="back">Back</SelectItem>
          <SelectItem value="shoulders">Shoulders</SelectItem>
          <SelectItem value="arms">Arms</SelectItem>
        </SelectGroup>
        <SelectSeparator/>
        <SelectGroup>
          <SelectLabel>Lower body</SelectLabel>
          <SelectItem value="legs">Legs</SelectItem>
          <SelectItem value="glutes">Glutes</SelectItem>
          <SelectItem value="calves">Calves</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function ControlsDemo() {
  const [done, setDone] = React.useState(true);
  const [notif, setNotif] = React.useState(true);
  const [units, setUnits] = React.useState("kg");
  return (
    <div className="row-gap-lg">
      <Field orientation="horizontal" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Checkbox id="ck1" checked={done} onCheckedChange={setDone}/>
        <FieldLabel htmlFor="ck1">Set completed</FieldLabel>
      </Field>
      <Field orientation="horizontal" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Switch id="sw1" checked={notif} onCheckedChange={setNotif}/>
        <FieldLabel htmlFor="sw1">Workout reminders</FieldLabel>
      </Field>
      <FieldSet>
        <FieldLegend variant="label">Preferred units</FieldLegend>
        <RadioGroup value={units} onValueChange={setUnits}>
          <Field orientation="horizontal" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <RadioGroupItem value="kg" id="u-kg"/>
            <FieldLabel htmlFor="u-kg">Kilograms (kg)</FieldLabel>
          </Field>
          <Field orientation="horizontal" style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <RadioGroupItem value="lb" id="u-lb"/>
            <FieldLabel htmlFor="u-lb">Pounds (lb)</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  );
}

function ToggleGroupDemo() {
  const [range, setRange] = React.useState("1m");
  const [tags, setTags]   = React.useState(["chest"]);
  return (
    <div className="row-gap-lg">
      <ToggleGroup type="single" value={range} onValueChange={setRange}>
        <ToggleGroupItem value="1w">1W</ToggleGroupItem>
        <ToggleGroupItem value="1m">1M</ToggleGroupItem>
        <ToggleGroupItem value="3m">3M</ToggleGroupItem>
        <ToggleGroupItem value="6m">6M</ToggleGroupItem>
        <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
        <ToggleGroupItem value="all">All</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="multiple" value={tags} onValueChange={setTags}>
        <ToggleGroupItem value="chest">Chest</ToggleGroupItem>
        <ToggleGroupItem value="back">Back</ToggleGroupItem>
        <ToggleGroupItem value="legs">Legs</ToggleGroupItem>
        <ToggleGroupItem value="shoulders">Shoulders</ToggleGroupItem>
        <ToggleGroupItem value="cardio">Cardio</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function SliderDemo() {
  const [val, setVal] = React.useState([7]);
  return (
    <div style={{ maxWidth: 380 }}>
      <Field>
        <FieldLabel>Intensity — <span className="text-muted">{val[0]} / 10</span></FieldLabel>
        <Slider value={val} onValueChange={setVal} min={0} max={10} step={1}/>
      </Field>
    </div>
  );
}

function InputGroupDemo() {
  return (
    <div className="row-gap-md" style={{ maxWidth: 420 }}>
      <Field>
        <FieldLabel>Search exercises</FieldLabel>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </InputGroupAddon>
          <InputGroupInput placeholder="Squat, deadlift, …"/>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel>Working weight</FieldLabel>
        <InputGroup>
          <InputGroupInput type="number" defaultValue="142.5"/>
          <InputGroupAddon align="inline-end">kg</InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}

function TableDemo() {
  const prs = [
    { ex: "Back Squat",   w: 142.5, r: 5, oneRm: 164.0, date: "Oct 24, 2025" },
    { ex: "Bench Press",  w: 105.0, r: 3, oneRm: 118.0, date: "Oct 18, 2025" },
    { ex: "Deadlift",     w: 180.0, r: 1, oneRm: 180.0, date: "Oct 02, 2025" },
    { ex: "Overhead Press", w: 65.0, r: 5, oneRm: 75.0, date: "Sep 28, 2025" },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exercise</TableHead>
          <TableHead>Weight (kg)</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>1RM est.</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prs.map(p => (
          <TableRow key={p.ex}>
            <TableCell style={{ fontWeight: 500 }}>{p.ex}</TableCell>
            <TableCell>{p.w.toFixed(1)}</TableCell>
            <TableCell>{p.r}</TableCell>
            <TableCell style={{ color: 'var(--primary)', fontWeight: 600 }}>{p.oneRm.toFixed(1)}</TableCell>
            <TableCell className="text-muted">{p.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AvatarDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar><AvatarImage src="https://i.pravatar.cc/64?img=11"/><AvatarFallback>LS</AvatarFallback></Avatar>
      <Avatar><AvatarImage src="not-a-real-url.jpg"/><AvatarFallback>PZ</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>NK</AvatarFallback></Avatar>
      <Avatar className="size-12" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}><AvatarFallback>+5</AvatarFallback></Avatar>
    </div>
  );
}

function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="ex1">
      <AccordionItem value="ex1">
        <AccordionTrigger>Barbell Back Squat — 4 sets × 8 reps @ 90kg</AccordionTrigger>
        <AccordionContent>
          Standing tall under the bar, brace your core, and descend until thighs are parallel. Drive through midfoot. Rest 2:30 between sets.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ex2">
        <AccordionTrigger>Romanian Deadlift — 3 sets × 10 reps @ 70kg</AccordionTrigger>
        <AccordionContent>
          Hinge at the hips with a slight knee bend. Bar travels close to the legs. Stop at mid-shin, feel the hamstrings.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ex3">
        <AccordionTrigger>Walking Lunge — 3 sets × 12 each leg</AccordionTrigger>
        <AccordionContent>
          Carry dumbbells. Step long, knee tracking over the toes. Pause briefly at the bottom.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function ProgressDemo() {
  const [v, setV] = React.useState(60);
  return (
    <div className="row-gap-md" style={{ maxWidth: 520 }}>
      <div>
        <div className="row-between" style={{ marginBottom: 6, fontSize: 13 }}>
          <span>Weekly goal</span>
          <span className="text-muted">{v}% of 5 sessions</span>
        </div>
        <Progress value={v}/>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" onClick={() => setV(Math.max(0, v - 20))}>−20</Button>
        <Button variant="outline" onClick={() => setV(Math.min(100, v + 20))}>+20</Button>
      </div>
    </div>
  );
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Add exercise to plan</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add exercise</DialogTitle>
          <DialogDescription>Pick from the master list and set your targets.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Exercise</FieldLabel>
            <SelectDemo/>
          </Field>
          <Field>
            <FieldLabel>Target sets × reps</FieldLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              <Input type="number" defaultValue="4"/>
              <Input type="number" defaultValue="8"/>
            </div>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button>Add</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="destructive">Delete plan</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "Leg Day A"?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the plan and unlinks any future sessions. Logged sessions stay in your history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => toast.success("Plan deleted")}>Delete plan</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open exercise details</Button></SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Barbell Back Squat</SheetTitle>
          <SheetDescription>Compound · Quads · Glutes</SheetDescription>
        </SheetHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Cue</FieldLabel>
            <Textarea defaultValue="Knees track over the toes. Brace before unracking."/>
          </Field>
          <Field>
            <FieldLabel>Working weight</FieldLabel>
            <InputGroup>
              <InputGroupInput type="number" defaultValue="142.5"/>
              <InputGroupAddon align="inline-end">kg</InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={() => toast.success("Changes saved")}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open quick log</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Log a quick set</DrawerTitle>
          <DrawerDescription>Bench Press · Set 3 of 4</DrawerDescription>
        </DrawerHeader>
        <FieldGroup>
          <Field>
            <FieldLabel>Weight</FieldLabel>
            <InputGroup>
              <InputGroupInput type="number" defaultValue="92.5"/>
              <InputGroupAddon align="inline-end">kg</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel>Reps</FieldLabel>
            <Input type="number" defaultValue="8"/>
          </Field>
        </FieldGroup>
        <DrawerFooter>
          <Button onClick={() => toast.success("Set logged")}>Log set</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function HoverDemo() {
  return (
    <div className="row-gap-md" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Hover for hint</Button></TooltipTrigger>
        <TooltipContent>Soft-deleted exercises stay in history.</TooltipContent>
      </Tooltip>

      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Filter</Button></PopoverTrigger>
        <PopoverContent align="start">
          <div className="row-gap-md">
            <div style={{ fontWeight: 500, fontSize: 14 }}>Filter by</div>
            <Field>
              <FieldLabel>Muscle</FieldLabel>
              <SelectDemo/>
            </Field>
          </div>
        </PopoverContent>
      </Popover>

      <HoverCard>
        <HoverCardTrigger asChild><a className="underline-link">@loris.sbaa</a></HoverCardTrigger>
        <HoverCardContent>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Avatar><AvatarFallback>LS</AvatarFallback></Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>Loris Sbaa</div>
              <div className="text-muted" style={{ fontSize: 13 }}>128 workouts · 78.4kg</div>
              <div className="text-muted" style={{ fontSize: 12, marginTop: 6 }}>Joined Jan 2024</div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function DropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">Row actions</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => toast("Started edit")}>Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut></DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast("Duplicated")}>Duplicate</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast.info("Shared link copied")}>Share</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onSelect={() => toast.error("Plan deleted")}>Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut></DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AlertDemo() {
  return (
    <div className="row-gap-md" style={{ maxWidth: 560 }}>
      <Alert>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
        <AlertTitle>Request pending</AlertTitle>
        <AlertDescription>Your request for "Weighted Bulgarian Split Squat" is awaiting review.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <AlertTitle>Couldn't save session</AlertTitle>
        <AlertDescription>Your session contains no completed sets. Log at least one set to save.</AlertDescription>
      </Alert>
    </div>
  );
}

function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>
        </EmptyMedia>
        <EmptyTitle>No workouts yet</EmptyTitle>
        <EmptyDescription>Start logging a session to see your stats and trends here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Log first workout</Button>
        <Button variant="outline">Browse exercises</Button>
      </EmptyContent>
    </Empty>
  );
}

function ToastDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="outline" onClick={() => toast("Session saved")}>Show toast</Button>
      <Button variant="outline" onClick={() => toast.success("Set logged — 142.5 kg × 5")}>Success</Button>
      <Button variant="outline" onClick={() => toast.error("Couldn't reach server")}>Error</Button>
      <Button variant="outline" onClick={() => toast.info("Welcome back!", { description: "You're on a 4-day streak." })}>Info + description</Button>
      <Button variant="outline" onClick={() => toast({ title: "Plan deleted", message: "Leg Day A is gone.", action: { label: "Undo", onClick: () => toast.success("Restored") } })}>With action</Button>
    </div>
  );
}

function LoadingDemo() {
  return (
    <div className="row-gap-md" style={{ maxWidth: 480 }}>
      <Card>
        <CardHeader>
          <Skeleton style={{ width: '60%', height: 18 }}/>
          <Skeleton style={{ width: '40%', height: 12, marginTop: 8 }}/>
        </CardHeader>
        <CardContent>
          <Skeleton style={{ width: '100%', height: 80 }}/>
        </CardContent>
      </Card>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button disabled><Spinner data-icon="inline-start"/>Saving…</Button>
        <Spinner style={{ color: 'var(--primary)' }}/>
        <span className="text-muted" style={{ fontSize: 13 }}>Spinner uses currentColor — color it via parent.</span>
      </div>
    </div>
  );
}

Object.assign(window, { ComponentsPage });
