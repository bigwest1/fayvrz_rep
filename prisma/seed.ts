import { PrismaClient, Prisma, ScriptChannel, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

type SeedScript = {
  channel: ScriptChannel;
  subject?: string;
  bodyMarkdown: string;
  variablesJson: Record<string, unknown>;
};

type SeedResource = {
  type: "LINK" | "PHONE" | "ADDRESS" | "FORM" | "CHECKLIST" | "SCRIPT" | "PRODUCT";
  title: string;
  description: string;
  url?: string;
  phone?: string;
  addressText?: string;
  stateCode?: string;
  countryCode?: string;
};

type SeedTask = {
  title: string;
  purpose: string;
  priority: TaskPriority;
  estimatedMinutes?: number;
  resources: SeedResource[];
  scripts: SeedScript[];
};

type SeedEvent = {
  slug: string;
  title: string;
  description: string;
  icon?: string;
  tags?: string[];
  tasks: SeedTask[];
};

const disclaimer = "Verify details locally and with official sources before taking action.";

const seedData: SeedEvent[] = [
  {
    slug: "new-baby",
    title: "New Baby",
    description: "Get coverage, care, and essentials ready without scrambling.",
    icon: "🍼",
    tags: ["family", "health"],
    tasks: [
      {
        title: "Set pediatric care and insurance",
        purpose: "Line up a first visit and confirm coverage so there are no surprises.",
        priority: TaskPriority.HIGH,
        estimatedMinutes: 40,
        resources: [
          {
            type: "LINK",
            title: "Find a nearby pediatrician",
            description: `${disclaimer} Start with your insurance directory or trusted local clinics.`,
            url: "https://www.healthcare.gov/find-doctor/",
          },
          {
            type: "FORM",
            title: "Add baby to insurance",
            description: `${disclaimer} Many plans require adding a newborn within 30 days.`,
            url: "https://www.healthcare.gov/newborns/",
          },
          {
            type: "PHONE",
            title: "State nurse line (general)",
            description: `${disclaimer} Call your state's nurse advice line for general questions.`,
            phone: "211",
            stateCode: "MN",
            countryCode: "US",
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "New baby coverage and first visit",
            bodyMarkdown:
              "Hello, my name is {{name}}. I live in {{city}}, {{state}}. I need to schedule a first pediatric visit for my newborn and confirm how to add them to my insurance. Please share available dates, required documents, and any costs. Thank you.",
            variablesJson: { fields: ["name", "city", "state"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, this is {{name}}. I live in {{city}}, {{state}}. I need to set a first pediatric visit and confirm adding my newborn to coverage. What documents and timelines should I know? Thanks.",
            variablesJson: { fields: ["name", "city", "state"] },
          },
        ],
      },
      {
        title: "Prepare leave paperwork",
        purpose: "Align employer forms and state leave so income stays predictable.",
        priority: TaskPriority.HIGH,
        estimatedMinutes: 35,
        resources: [
          {
            type: "LINK",
            title: "Family leave overview",
            description: `${disclaimer} General guide to U.S. family leave options.`,
            url: "https://www.dol.gov/general/topic/workhours/fmla",
          },
          {
            type: "FORM",
            title: "Employer leave form placeholder",
            description: `${disclaimer} Request the latest form from HR to avoid outdated templates.`,
            url: "https://www.dol.gov/agencies/whd/fmla/forms",
          },
          {
            type: "CHECKLIST",
            title: "Documents to gather",
            description: `${disclaimer} ID, proof of employment, expected due/birth date confirmation.`,
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "Family leave paperwork request",
            bodyMarkdown:
              "Hello, I’m requesting the current leave paperwork for a new child. I plan to start leave on {{startDate}}. Please confirm required forms, timelines, and who should sign them. Thank you.",
            variablesJson: { fields: ["startDate"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, I’m calling to confirm the forms and steps for my upcoming leave starting {{startDate}}. Which documents and approvals do you need, and by when?",
            variablesJson: { fields: ["startDate"] },
          },
        ],
      },
      {
        title: "Set up essentials kit",
        purpose: "Keep feeding, sleep, and transport basics ready.",
        priority: TaskPriority.MEDIUM,
        estimatedMinutes: 25,
        resources: [
          {
            type: "CHECKLIST",
            title: "Essentials checklist",
            description: `${disclaimer} Diapers, wipes, onesies, safe sleep space, car seat install.`,
          },
          {
            type: "LINK",
            title: "Car seat installation help",
            description: `${disclaimer} Check for certified technicians near you.`,
            url: "https://www.nhtsa.gov/equipment/car-seats-and-booster-seats",
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, I’m looking for a car seat safety check and tips on infant essentials. Do you offer appointments or community events for this? I’m in {{city}}, {{state}}.",
            variablesJson: { fields: ["city", "state"] },
          },
        ],
      },
    ],
  },
  {
    slug: "job-loss",
    title: "Job Loss",
    description: "Stabilize income, coverage, and outreach after a job ends.",
    icon: "🧭",
    tags: ["career", "finance"],
    tasks: [
      {
        title: "File for unemployment",
        purpose: "Start benefits and know reporting requirements early.",
        priority: TaskPriority.HIGH,
        estimatedMinutes: 45,
        resources: [
          {
            type: "LINK",
            title: "State unemployment portal",
            description: `${disclaimer} Use your state portal to file and review weekly rules.`,
            url: "https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/find-unemployment-benefits.aspx",
          },
          {
            type: "FORM",
            title: "Weekly certification reminder",
            description: `${disclaimer} Set a weekly reminder to submit claims on time.`,
          },
          {
            type: "PHONE",
            title: "Unemployment help line (generic)",
            description: `${disclaimer} State phone support for claim questions.`,
            phone: "211",
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "Question about unemployment claim",
            bodyMarkdown:
              "Hello, I’m filing for unemployment after a layoff. I want to confirm which documents you need and the weekly reporting deadlines. My state is {{state}}. Thank you.",
            variablesJson: { fields: ["state"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, I’m calling about starting an unemployment claim. I’m in {{state}}. What documents and timelines should I prepare to avoid delays?",
            variablesJson: { fields: ["state"] },
          },
        ],
      },
      {
        title: "Review health coverage options",
        purpose: "Avoid coverage gaps by comparing COBRA and marketplace timing.",
        priority: TaskPriority.HIGH,
        estimatedMinutes: 30,
        resources: [
          {
            type: "LINK",
            title: "Marketplace coverage options",
            description: `${disclaimer} Review deadlines for Special Enrollment Period after job loss.`,
            url: "https://www.healthcare.gov/unemployed/coverage/",
          },
          {
            type: "FORM",
            title: "COBRA election window reminder",
            description: `${disclaimer} Note typical 60-day election window; verify with your plan.`,
          },
          {
            type: "CHECKLIST",
            title: "Coverage comparison",
            description: `${disclaimer} List premiums, deductibles, deadlines for each option.`,
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "Coverage options after layoff",
            bodyMarkdown:
              "Hi, I recently lost my job and need to review COBRA vs marketplace timing. I’m in {{state}}. Please confirm my deadlines and any forms needed.",
            variablesJson: { fields: ["state"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hello, I’m calling to confirm coverage options after a layoff in {{state}}. What deadlines and documents should I know?",
            variablesJson: { fields: ["state"] },
          },
        ],
      },
      {
        title: "Line up references and outreach",
        purpose: "Prepare quick references and notes for job applications.",
        priority: TaskPriority.MEDIUM,
        estimatedMinutes: 35,
        resources: [
          {
            type: "LINK",
            title: "Reference request template",
            description: `${disclaimer} Customize and confirm consent before listing anyone.`,
            url: "https://www.careeronestop.org/JobSearch/Network/reference-letters.aspx",
          },
          {
            type: "CHECKLIST",
            title: "Reference details",
            description: `${disclaimer} Name, role, contact, project example, permission date.`,
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "Request to use you as a reference",
            bodyMarkdown:
              "Hi {{contactName}}, I’m starting a search and would appreciate using you as a reference. I’m targeting roles in {{targetRoles}}. I’ll share a short summary to make it easy. Let me know if that’s okay.",
            variablesJson: { fields: ["contactName", "targetRoles"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi {{contactName}}, I’m starting a job search and would like to list you as a reference for {{targetRoles}} roles. Is that okay, and is there any info you prefer I share?",
            variablesJson: { fields: ["contactName", "targetRoles"] },
          },
        ],
      },
    ],
  },
  {
    slug: "washing-machine-broke",
    title: "Washing Machine Broke",
    description: "Get clothes handled while deciding repair, replace, or service.",
    icon: "🧺",
    tags: ["home", "maintenance"],
    tasks: [
      {
        title: "Check warranty and model",
        purpose: "Know coverage and parts before paying for service.",
        priority: TaskPriority.MEDIUM,
        estimatedMinutes: 20,
        resources: [
          {
            type: "LINK",
            title: "Manufacturer support lookup",
            description: `${disclaimer} Find warranty terms using the model number.`,
            url: "https://www.usa.gov/consumer-complaints",
          },
          {
            type: "CHECKLIST",
            title: "Model details to record",
            description: `${disclaimer} Model, serial, purchase date, symptoms, error codes.`,
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "Washer model lookup and warranty check",
            bodyMarkdown:
              "Hello, my washer model {{modelNumber}} is having issues: {{symptoms}}. Can you confirm warranty status and recommended next steps? I am in {{city}}, {{state}}.",
            variablesJson: { fields: ["modelNumber", "symptoms", "city", "state"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, I need to check warranty and support for washer model {{modelNumber}}. Symptoms: {{symptoms}}. I’m in {{city}}, {{state}}.",
            variablesJson: { fields: ["modelNumber", "symptoms", "city", "state"] },
          },
        ],
      },
      {
        title: "Arrange short-term laundry",
        purpose: "Ensure clothes get cleaned while repair is pending.",
        priority: TaskPriority.LOW,
        estimatedMinutes: 15,
        resources: [
          {
            type: "LINK",
            title: "Local laundromat finder (generic)",
            description: `${disclaimer} Check hours and payment methods before going.`,
            url: "https://www.google.com/maps/search/laundromat/",
          },
          {
            type: "PHONE",
            title: "Laundry pickup service inquiry",
            description: `${disclaimer} Call to confirm pricing and turnaround time.`,
            phone: "211",
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, I’m looking for laundry service options near {{city}}, {{state}}. Do you offer pickup, and what’s the turnaround and cost?",
            variablesJson: { fields: ["city", "state"] },
          },
        ],
      },
      {
        title: "Get repair estimates",
        purpose: "Compare repair vs replacement with clear estimates.",
        priority: TaskPriority.HIGH,
        estimatedMinutes: 30,
        resources: [
          {
            type: "LINK",
            title: "Consumer repair guidance",
            description: `${disclaimer} Typical washer repair costs and questions to ask.`,
            url: "https://www.consumer.ftc.gov/articles/repair-scams",
          },
          {
            type: "CHECKLIST",
            title: "Estimate questions",
            description: `${disclaimer} Parts availability, labor, trip fees, warranty on work.`,
          },
        ],
        scripts: [
          {
            channel: ScriptChannel.EMAIL,
            subject: "Washer repair estimate request",
            bodyMarkdown:
              "Hello, my washer model {{modelNumber}} is having issues: {{symptoms}}. Can you provide an estimate and earliest visit date? I’m in {{city}}, {{state}}.",
            variablesJson: { fields: ["modelNumber", "symptoms", "city", "state"] },
          },
          {
            channel: ScriptChannel.PHONE,
            bodyMarkdown:
              "Hi, I need an estimate for repairing washer model {{modelNumber}}. Issue: {{symptoms}}. I’m in {{city}}, {{state}}. What’s your earliest visit and estimated cost?",
            variablesJson: { fields: ["modelNumber", "symptoms", "city", "state"] },
          },
        ],
      },
    ],
  },
];

async function upsertLifeEvent(event: SeedEvent) {
  const lifeEvent = await prisma.lifeEvent.upsert({
    where: { slug: event.slug },
    update: {
      title: event.title,
      description: event.description,
      icon: event.icon,
      tags: event.tags ?? [],
    },
    create: {
      slug: event.slug,
      title: event.title,
      description: event.description,
      icon: event.icon,
      tags: event.tags ?? [],
    },
  });

  for (const task of event.tasks) {
    const existingTask = await prisma.taskTemplate.findFirst({
      where: { lifeEventId: lifeEvent.id, title: task.title },
    });

    const taskTemplate =
      existingTask ??
      (await prisma.taskTemplate.create({
        data: {
          lifeEventId: lifeEvent.id,
          title: task.title,
          purpose: task.purpose,
          priority: task.priority,
          estimatedMinutes: task.estimatedMinutes,
        },
      }));

    if (existingTask) {
      await prisma.taskTemplate.update({
        where: { id: taskTemplate.id },
        data: {
          purpose: task.purpose,
          priority: task.priority,
          estimatedMinutes: task.estimatedMinutes,
        },
      });
    }

    for (const resource of task.resources) {
      const existingResource = await prisma.resourceTemplate.findFirst({
        where: { taskTemplateId: taskTemplate.id, title: resource.title },
      });

      if (existingResource) {
        await prisma.resourceTemplate.update({
          where: { id: existingResource.id },
          data: {
            description: resource.description,
            url: resource.url,
            phone: resource.phone,
            addressText: resource.addressText,
            stateCode: resource.stateCode,
            countryCode: resource.countryCode,
            type: resource.type,
            title: resource.title,
          },
        });
      } else {
        await prisma.resourceTemplate.create({
          data: {
            taskTemplateId: taskTemplate.id,
            type: resource.type,
            title: resource.title,
            description: resource.description,
            url: resource.url,
            phone: resource.phone,
            addressText: resource.addressText,
            stateCode: resource.stateCode,
            countryCode: resource.countryCode,
          },
        });
      }
    }

    for (const script of task.scripts) {
      const existingScript = await prisma.scriptTemplate.findFirst({
        where: { taskTemplateId: taskTemplate.id, channel: script.channel },
      });

      if (existingScript) {
        await prisma.scriptTemplate.update({
          where: { id: existingScript.id },
          data: {
            subject: script.subject,
            bodyMarkdown: script.bodyMarkdown,
            variablesJson: script.variablesJson as Prisma.InputJsonValue,
          },
        });
      } else {
        await prisma.scriptTemplate.create({
          data: {
            taskTemplateId: taskTemplate.id,
            channel: script.channel,
            subject: script.subject,
            bodyMarkdown: script.bodyMarkdown,
            variablesJson: script.variablesJson as Prisma.InputJsonValue,
          },
        });
      }
    }
  }
}

async function main() {
  for (const event of seedData) {
    await upsertLifeEvent(event);
  }
  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
