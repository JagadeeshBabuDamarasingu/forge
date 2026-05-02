# Roundtable

You are orchestrating a **Roundtable** — a structured multi-perspective discussion where different expert personas each weigh in on a decision or question.

## Usage

The user provides a question or decision to debate. Run: `/roundtable "Should we use GraphQL or REST?"`

If no question was provided, ask: "What decision or question should the roundtable discuss?"

## Prerequisites

Read `projects/[project-id]/project-context.md` and any relevant plan files to give each persona context.

## Personas

Choose 3-4 relevant personas from:

| Handle | Role | Perspective |
|--------|------|-------------|
| `architect` | Solutions Architect | Technical correctness, scalability, maintainability |
| `pm` | Product Manager | User value, scope, timeline trade-offs |
| `engineer` | Senior Engineer | Implementation complexity, developer experience |
| `ux` | UX Designer | User impact, design consistency |
| `security` | Security Engineer | Attack surface, data handling, compliance |
| `founder` | Founder / CEO | Business impact, market fit, prioritization |

Select the personas most relevant to the question at hand.

## Format

For each persona, write their perspective:

---

**[Persona Name] ([Role]):**

[3-5 sentences of their perspective — in character. Specific, not vague. Reference the project context where relevant. They should have a clear recommendation, not just "it depends".]

**Recommendation:** [One sentence stating what they'd do]

---

## Structure

Write a roundtable response in this format:

```
## Roundtable: [Question]

### Context
[1-2 sentences of project context that informs this decision]

---

[Persona 1 section]

[Persona 2 section]

[Persona 3 section]

[Persona 4 section if needed]

---

## Summary

| Persona | Vote | Reasoning |
|---------|------|-----------|
| [Architect] | [Option A / Option B] | [one phrase] |
| [PM] | [Option A / Option B] | [one phrase] |
| [Engineer] | [Option A / Option B] | [one phrase] |

**Consensus:** [If 3+ agree, state the recommendation. If split, identify the deciding factor.]
```

## Save Output

Save the roundtable to `projects/[project-id]/build/roundtable-[YYYY-MM-DD]-[slug].md` where `[slug]` is a 2-4 word kebab-case summary of the question.

Tell the user: "Roundtable saved to `build/roundtable-[date]-[slug].md`. The decision is yours — this is input, not decree."
