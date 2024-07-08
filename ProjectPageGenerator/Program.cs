namespace ProjectPageGenerator
{
    internal class Program
    {
        struct Output(string name)
        {
            public string name = name;
            public StreamWriter writer = new StreamWriter(name.Replace(".html", suffix));
            public StreamReader reader = new StreamReader(name);

            public const string suffix = "_final.html";

            public void Close()
            {
                writer.Close();
                reader.Close();
            }


            public string GetContent()
            {
                return reader.ReadToEnd();
            }
        }

        static void Main(string[] args)
        {

            const string templatePath = "template.html";

            StreamReader input = new(templatePath);
            string template = input.ReadToEnd();
            input.Close();


            string[] files = Directory.GetFiles(Directory.GetCurrentDirectory());

            for(int i = 0; i < files.Length; i++)
            {
                files[i] = Path.GetFileName(files[i]);
            }


            foreach(string file in files)
            {
                if (file == templatePath) continue;

                if (file.EndsWith(Output.suffix)) continue;

                Output output = new Output(file);

                output.writer.WriteLine(template.Replace("<content>", output.GetContent()));
                output.Close();
            }

            input.Close();
        }
    }
}
