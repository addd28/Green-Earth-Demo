import issueForests from "@/assets/issue-forests.jpg";
import issueOceans from "@/assets/issue-oceans.jpg";
import issueClimate from "@/assets/issue-climate.jpg";

const issues = [
  { image: issueForests, title: "Forests", description: "Protecting the world's remaining ancient forests and the people who depend on them." },
  { image: issueOceans, title: "Oceans", description: "Defending our seas from destructive fishing, pollution, and deep-sea mining." },
  { image: issueClimate, title: "Climate", description: "Demanding a just transition to 100% renewable energy for everyone, everywhere." },
];

const IssuesSection = () => (
  <section className="bg-background py-20">
    <div className="container mx-auto px-4 lg:px-8">
      <h2 className="font-heading text-3xl md:text-5xl text-foreground text-center mb-16">
        The issues we work on
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {issues.map((issue) => (
          <a key={issue.title} href="#" className="group block overflow-hidden">
            <div className="overflow-hidden">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-heading text-xl mt-4 text-foreground group-hover:text-gp-green transition-colors">
              {issue.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {issue.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default IssuesSection;
